import React from "react";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import {useFetch} from "../utils/hooks";


export default function Configuration() {
    const url = 'https://statsapi.web.nhl.com/api/v1/teams';

    const {status, data, error} = useFetch(url);

    // const [checkedItems] = useState({
    //     checkedItems: new Map()
    // });

    const handleChange = (event) => {
        console.log(event);
        const isChecked = event.target.checked;
        const item = event.target.value;
        this.setState(prevState => {
            console.log(prevState);
            return { checkedItems: prevState.checkedItems.set(item, isChecked) }});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e);
    }

    const teams = data.teams;


    return (
        <div>
            {status === 'idle' && (
                <div> Let's get started by searching for an article! </div>
            )}
            {status === 'error' && <div>{error}</div>}
            {status === 'fetching' && <div className="loading"></div>}
            {status === 'fetched' && <>
                <div>
                    <form className="Form" onSubmit={handleSubmit}>
                        {teams.map((team) => (
                            <div>
                                <FormControlLabel
                                    control={<Checkbox onChange={handleChange}
                                                       value={team.id}
                                                       name={`team${team.id}`}/>}
                                    label={team.name}
                                />
                            </div>
                        ))
                        }
                        <button> Save</button>
                    </form>
                </div>
            </>
            }


        </div>
    );
}
