import React, {useState} from "react";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import {useFetch} from "../utils/hooks";
import {Configuration} from "../utils/Configuration";
import './configuration.css';

export default function ConfigurationView() {
    const [prefferedTeams, setPrefferedTeams] = useState(Configuration.getPrefferedTeams());
    const url = 'https://statsapi.web.nhl.com/api/v1/teams';

    const {status, data, error} = useFetch(url);

    const handleChange = (event) => {
        const teamId = parseInt(event.target.value);
        let selectedTeams = [...prefferedTeams];
        if (event.target.checked) {
            selectedTeams.push(teamId);
        } else {
            selectedTeams.splice(selectedTeams.indexOf(teamId), 1);
        }

        setPrefferedTeams(selectedTeams);
        Configuration.setPrefferedTeams(selectedTeams);
    };

    let teams = data.teams;
    teams = teams?.sort((a, b) => (a.name > b.name) ? 1 : -1)

    return (
        <div>
            <h1>Select your preffered team</h1>
            {status === 'idle' && (
                <div> Let's get started by searching for an article! </div>
            )}
            {status === 'error' && <div>{error}</div>}
            {status === 'fetching' && <div className="loading"></div>}
            {status === 'fetched' && <>
                <div>
                    <ul>
                        {teams.map((team) => (
                            <li>
                                <FormControlLabel
                                    control={<Checkbox onChange={handleChange}
                                                       value={team.id}
                                                       checked={prefferedTeams.indexOf(team.id) > -1}
                                                       name={`team${team.id}`}/>}
                                    label={<>
                                        <div style={{width: 50, height: 50}}
                                             className={`team-logo logo-bg-dark--team-${team?.id}`}></div>
                                        {team.name}
                                    </>}
                                />
                            </li>
                        ))
                        }
                    </ul>
                </div>
            </>
            }


        </div>
    );
}
