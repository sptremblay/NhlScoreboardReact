import React, { useState, useEffect } from 'react';
import { createMuiTheme, MuiThemeProvider, responsiveFontSizes, Typography } from "@material-ui/core";
import GameCard from "./components/GameCard";
import { getGamesForDate, getTodayDateString } from "./utils/NewNhlApiHelper";
import './App.css';

function App() {
    const [games, setGames] = useState([]);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let theme = createMuiTheme();
    theme = responsiveFontSizes(theme);

    // Fetch games on component mount
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                setError(null);
                const dateString = getTodayDateString();
                const data = await getGamesForDate(dateString);
                
                // Parse games from the new API format
                const gamesList = data.games || [];
                
                if (gamesList.length === 0) {
                    setError('No games scheduled for today');
                    setGames([]);
                } else {
                    // Transform data to a standardized format
                    const transformedGames = gamesList.map(game => ({
                        id: game.id,
                        gameState: game.gameState,
                        homeTeam: {
                            id: game.homeTeam?.id,
                            name: game.homeTeam?.name,
                            abbrev: game.homeTeam?.abbrev,
                            record: game.homeTeam?.record,
                            logo: game.homeTeam?.logo
                        },
                        awayTeam: {
                            id: game.awayTeam?.id,
                            name: game.awayTeam?.name,
                            abbrev: game.awayTeam?.abbrev,
                            record: game.awayTeam?.record,
                            logo: game.awayTeam?.logo
                        },
                        period: game.periodDescriptor?.periodType === 'REG' 
                            ? `${game.periodDescriptor?.number}${getOrdinalSuffix(game.periodDescriptor?.number)} PERIOD`
                            : game.periodDescriptor?.periodType || '',
                        clock: game.clock?.timeRemaining,
                        goals: {
                            home: game.homeTeam?.score,
                            away: game.awayTeam?.score
                        },
                        shots: {
                            home: game.homeTeam?.sog,
                            away: game.awayTeam?.sog
                        },
                        startTime: game.startTimeUTC
                    }));
                    
                    setGames(transformedGames);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError(`Error loading games: ${err.message}`);
                setLoading(false);
            }
        };

        fetchGames();
        
        // Refresh data every 30 seconds
        const refreshInterval = setInterval(fetchGames, 30000);
        
        return () => clearInterval(refreshInterval);
    }, []);

    // Carousel effect - rotate through games every 12 seconds
    useEffect(() => {
        if (games.length <= 1) {
            return; // No need to rotate if there's only one or no games
        }

        const carouselInterval = setInterval(() => {
            setCurrentGameIndex((prevIndex) => (prevIndex + 1) % games.length);
        }, 12000); // 12 seconds between rotations

        return () => clearInterval(carouselInterval);
    }, [games]);

    // Render loading state
    if (loading) {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App-header">
                    <Typography variant="h4">Loading NHL games...</Typography>
                </div>
            </MuiThemeProvider>
        );
    }

    // Render error state
    if (error) {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App-header">
                    <Typography variant="h4" color="error">
                        {error}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                        Please check your internet connection and try again.
                    </Typography>
                </div>
            </MuiThemeProvider>
        );
    }

    // Render current game
    const currentGame = games[currentGameIndex];

    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                {currentGame ? (
                    <GameCard game={currentGame} />
                ) : (
                    <div className="App-header">
                        <Typography variant="h4">No games available</Typography>
                    </div>
                )}
                
                {/* Game counter indicator */}
                {games.length > 1 && (
                    <div style={{ 
                        textAlign: 'center', 
                        marginTop: '20px',
                        color: '#888'
                    }}>
                        <Typography variant="body2">
                            Game {currentGameIndex + 1} of {games.length}
                        </Typography>
                    </div>
                )}
            </div>
        </MuiThemeProvider>
    );
}

/**
 * Helper function to get ordinal suffix for period numbers
 */
function getOrdinalSuffix(num) {
    if (!num) return '';
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

export default App;

