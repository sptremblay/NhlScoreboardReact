import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {Grid, Typography} from '@material-ui/core';
import equal from "fast-deep-equal/react";
import './scoreticker.css';
import '../css/nhl-logo.css';

import {NhlApiHelper} from '../utils/NhlApiHelper';

class Scoreticker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            games: [],
            currentGameIndex: 0
        }
    }

    componentDidMount() {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        NhlApiHelper.getSchedule(todayStr, todayStr)
            .then((data) => {
                    this.setState({games: data.dates[0].games});
                }
            );

        this.interval = setInterval(() => {
            this.setState({time: Date.now()});
            let index = this.state.currentGameIndex + 1;
            if (index >= this.state.games.length)
                index = 0;
            this.setState({currentGameIndex: index})
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const gamesLi = [];
        const currentGame = this.state.games[this.state.currentGameIndex];

        for (const g of this.state.games) {
            gamesLi.push(<li>{g.gamePk}</li>)
        }
        if (currentGame) {
            if (currentGame?.status.statusCode < 3) {
                return <ScoreboardPregame currentGame={currentGame}></ScoreboardPregame>
            } else {
                return <ScoreboardLive currentGame={currentGame}></ScoreboardLive>
            }
        } else {
            return <div>Loading</div>
        }
    }
}

const ScoreboardPregame = ({currentGame}) => {
    let gameDate = '';
    let gameHour = '';
    if (currentGame) {
        const gd = new Date(currentGame.gameDate);
        if (isToday(gd))
            gameDate = 'TODAY';
        else
            gameDate = 'TOMORROW';

        const dtf = new Intl.DateTimeFormat('en-US', {timeStyle: 'short'});
        gameHour = dtf.format(gd);
    }
    return <div>
        <div className="container-fluid lg-p-top">
            <Typography variant="h3" align="center" className="lg-mg-bottom">
                {gameDate}
            </Typography>
            <Typography variant="h5" align="center" className="lg-mg-bottom">
                {gameHour}
            </Typography>
            <div className="container-fluid">
                <Grid container
                      direction="row"
                      justify="center"
                      alignItems="center" spacing={2}>
                    <Grid
                        item
                        data-aos="zoom-in-up"
                    >
                        <ScoreboardTeamInfo team={currentGame?.teams.home.team}
                                            leagueRecord={currentGame?.teams.home.leagueRecord}></ScoreboardTeamInfo>
                    </Grid>

                    <Grid
                        xs={2}
                        item
                        data-aos="zoom-in-up"
                    >
                            <span className="big-text">
                                VS
                            </span>
                    </Grid>

                    <Grid
                        item
                        data-aos="zoom-in-up"
                    >
                        <ScoreboardTeamInfo team={currentGame?.teams.away.team}
                                            leagueRecord={currentGame?.teams.away.leagueRecord}></ScoreboardTeamInfo>
                    </Grid>
                </Grid>
            </div>
        </div>
    </div>
}

class ScoreboardLive extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gamePk: props.currentGame?.gamePk,
            game: null
        }
    }

    componentDidMount() {
        this.getGameData();
    }

    getGameData() {
        NhlApiHelper.getGameFeed(this.state.gamePk)
            .then((data) => {
                    this.setState({game: data.game});
                    this.forceUpdate();
                }
            );
    }

    componentDidUpdate(prevProps) {
        if (!equal(this.props.currentGame?.gamePk, prevProps.currentGame?.gamePk)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.setState({gamePk: this.props.currentGame?.gamePk});
            this.getGameData();
        }
    }

    render() {
        return <div>
            <div className="container-fluid lg-p-top">
                <Typography variant="h3" align="center" className="lg-mg-bottom">
                    {this.state.game?.liveData.linescore?.currentPeriodOrdinal?.toUpperCase()}
                </Typography>
                <Typography variant="h5" align="center" className="lg-mg-bottom">
                    {this.state.game?.liveData.linescore?.currentPeriodTimeRemaining?.toUpperCase()}
                </Typography>
                <div className="container-fluid">
                    <Grid container
                          direction="row"
                          justify="center"
                          alignItems="center" spacing={2}>
                        <Grid
                            item
                            data-aos="zoom-in-up"
                        >
                            <ScoreboardTeamInfo team={this.state.game?.gameData.teams.home}></ScoreboardTeamInfo>
                        </Grid>

                        <Grid
                            xs={2}
                            item
                            data-aos="zoom-in-up"
                        >
                            <Grid container
                                  direction="column"
                                  justify="center"
                                  alignItems="center">
                                <Grid item>
                            <span className="big-text">
                                {this.state.game?.liveData.linescore?.teams.home.goals}
                                -
                                {this.state.game?.liveData.linescore?.teams.away.goals}
                            </span>
                                </Grid>
                                <Grid item>
                                    Shots
                                </Grid>
                                <Grid item>
                                    {this.state.game?.liveData.linescore?.teams.home.shotsOnGoal}
                                    -
                                    {this.state.game?.liveData.linescore?.teams.away.shotsOnGoal}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid
                            item
                            data-aos="zoom-in-up"
                        >
                            <ScoreboardTeamInfo team={this.state.game?.gameData.teams.away}></ScoreboardTeamInfo>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    }
}

const ScoreboardTeamInfo = ({team, leagueRecord}) => {
    return <Grid container
                 direction="column"
                 justify="center"
                 alignItems="center"
    >
        <Grid item>
            <div className={`team-logo logo-bg-dark--team-${team?.id}`}></div>
        </Grid>
        <Grid item>
            <Typography variant="h4">
                {team?.name}
            </Typography>
        </Grid>
        <Grid>
            <Typography variant="h6">
                ({leagueRecord?.wins}-{leagueRecord?.losses}-{leagueRecord?.ot})
            </Typography>
        </Grid>
    </Grid>;
}

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}

export default withRouter(Scoreticker);
