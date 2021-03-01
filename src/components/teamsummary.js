import {Component} from "react";

import {Configuration} from "../utils/Configuration";
import { NhlApiHelper } from "../utils/NhlApiHelper";

class TeamSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prefferedTeams: [],
            currentTeam: null,
            currentTeamIndex: 0
        }
    }

    componentDidMount() {
        this.setState({prefferedTeams: Configuration.getPrefferedTeams()}
        );

        this.interval = setInterval(() => {
            this.setState({time: Date.now()});
            let index = this.state.currentTeamIndex + 1;
            if (index >= this.state?.prefferedTeams?.length)
                index = 0;
            this.setState({currentTeamIndex: index});
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        if(!this.state.prefferedTeams){
            return <div>No teams</div>
        }

        console.log('test');
        const currentTeamId = this.state.prefferedTeams[this.state.currentTeamIndex];
        let currentTeam = null;
        NhlApiHelper.getTeam(currentTeamId).then((response)=>{
            currentTeam = response.team.teams[0];
        });

        return <div>
            <span>{currentTeam?.name}</span>
        </div>
    }
}


export default TeamSummary;
