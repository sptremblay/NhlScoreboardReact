import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import '../css/nhl-logo.css';

/**
 * Component to display a single NHL game
 */
const GameCard = ({ game }) => {
    if (!game) {
        return null;
    }

    const { homeTeam, awayTeam, gameState, period, clock, goals } = game;

    // Determine if game is live or finished
    const isLive = gameState === 'LIVE' || gameState === 'CRIT';
    const isFinal = gameState === 'FINAL' || gameState === 'OFF';
    const isPregame = gameState === 'PRE' || gameState === 'FUT';

    return (
        <div className="container-fluid lg-p-top">
            {/* Game Status */}
            <Typography variant="h3" align="center" className="lg-mg-bottom">
                {isPregame && 'UPCOMING'}
                {isLive && (period ? `${period}` : 'LIVE')}
                {isFinal && 'FINAL'}
            </Typography>

            {/* Time remaining for live games */}
            {isLive && clock && (
                <Typography variant="h5" align="center" className="lg-mg-bottom">
                    {clock}
                </Typography>
            )}

            {/* Teams and Score */}
            <div className="container-fluid">
                <Grid container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      spacing={2}>
                    {/* Away Team */}
                    <Grid item>
                        <TeamInfo 
                            team={awayTeam}
                        />
                    </Grid>

                    {/* Score/VS Separator */}
                    <Grid xs={2} item>
                        <Grid container
                              direction="column"
                              justify="center"
                              alignItems="center">
                            {isPregame ? (
                                <Grid item>
                                    <span className="big-text">VS</span>
                                </Grid>
                            ) : (
                                <>
                                    <Grid item>
                                        <span className="big-text">
                                            {goals?.away || 0} - {goals?.home || 0}
                                        </span>
                                    </Grid>
                                    {/* Show shots on goal for live/final games */}
                                    {(isLive || isFinal) && game.shots && (
                                        <>
                                            <Grid item>
                                                <Typography variant="body2">Shots</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1">
                                                    {game.shots.away || 0} - {game.shots.home || 0}
                                                </Typography>
                                            </Grid>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
                    </Grid>

                    {/* Home Team */}
                    <Grid item>
                        <TeamInfo 
                            team={homeTeam}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

/**
 * Component to display team information
 */
const TeamInfo = ({ team }) => {
    if (!team) {
        return null;
    }

    return (
        <Grid container
              direction="column"
              justify="center"
              alignItems="center">
            {/* Team Logo */}
            <Grid item>
                <div className={`team-logo logo-bg-dark--team-${team.id}`}></div>
            </Grid>
            {/* Team Name */}
            <Grid item>
                <Typography variant="h4">
                    {team.name?.default || team.commonName?.default || team.abbrev || 'Team'}
                </Typography>
            </Grid>
            {/* Team Record */}
            {team.record && (
                <Grid item>
                    <Typography variant="h6">
                        ({team.record})
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};

export default GameCard;
