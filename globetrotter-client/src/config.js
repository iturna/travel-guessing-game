const config = {
    apiBaseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://travel-guessing-game-production.up.railway.app' 
        : 'http://localhost:5047',
    endpoints: {
        register: '/api/users/register',
        randomDestination: '/api/game/random-destination',
        checkAnswer: '/api/game/check-answer',
        getByInviteCode: '/api/users/by-invite-code'
    }
};

export default config;