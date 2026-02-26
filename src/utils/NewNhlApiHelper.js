/**
 * Helper for the new NHL API (api-web.nhle.com/v1/)
 */

// Mock data for testing when API is not accessible
const MOCK_DATA = {
    games: [
        {
            id: 2023021234,
            gameState: "LIVE",
            startTimeUTC: "2024-03-15T23:00:00Z",
            homeTeam: {
                id: 10,
                name: { default: "Toronto Maple Leafs" },
                abbrev: "TOR",
                score: 3,
                sog: 25,
                logo: "https://assets.nhle.com/logos/nhl/svg/TOR_light.svg"
            },
            awayTeam: {
                id: 8,
                name: { default: "Montreal Canadiens" },
                abbrev: "MTL",
                score: 2,
                sog: 18,
                logo: "https://assets.nhle.com/logos/nhl/svg/MTL_light.svg"
            },
            periodDescriptor: {
                number: 2,
                periodType: "REG"
            },
            clock: {
                timeRemaining: "12:34"
            }
        },
        {
            id: 2023021235,
            gameState: "FINAL",
            startTimeUTC: "2024-03-15T23:30:00Z",
            homeTeam: {
                id: 24,
                name: { default: "Anaheim Ducks" },
                abbrev: "ANA",
                score: 4,
                sog: 32,
                logo: "https://assets.nhle.com/logos/nhl/svg/ANA_light.svg"
            },
            awayTeam: {
                id: 28,
                name: { default: "San Jose Sharks" },
                abbrev: "SJS",
                score: 2,
                sog: 28,
                logo: "https://assets.nhle.com/logos/nhl/svg/SJS_light.svg"
            },
            periodDescriptor: {
                number: 3,
                periodType: "REG"
            }
        },
        {
            id: 2023021236,
            gameState: "FUT",
            startTimeUTC: "2024-03-16T00:00:00Z",
            homeTeam: {
                id: 23,
                name: { default: "Vancouver Canucks" },
                abbrev: "VAN",
                score: 0,
                sog: 0,
                logo: "https://assets.nhle.com/logos/nhl/svg/VAN_light.svg"
            },
            awayTeam: {
                id: 25,
                name: { default: "Dallas Stars" },
                abbrev: "DAL",
                score: 0,
                sog: 0,
                logo: "https://assets.nhle.com/logos/nhl/svg/DAL_light.svg"
            }
        }
    ]
};

/**
 * Fetch games for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {boolean} useMock - Use mock data instead of real API (for testing)
 * @returns {Promise} Promise with game data
 */
export async function getGamesForDate(date, useMock = false) {
    // Use mock data if requested or if API is not accessible
    if (useMock || process.env.REACT_APP_USE_MOCK === 'true') {
        return Promise.resolve(MOCK_DATA);
    }
    
    try {
        const response = await fetch(`https://api-web.nhle.com/v1/score/${date}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch games: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        // Fallback to mock data if API fails
        console.warn('API call failed, using mock data:', error.message);
        return Promise.resolve(MOCK_DATA);
    }
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
