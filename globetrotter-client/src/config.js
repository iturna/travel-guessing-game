const config = {
    //apiBaseUrl: window.location.hostname === 'localhost' 
    //? 'http://localhost:5047'
    //: `http://${window.location.hostname}:5047`,
    apiBaseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-api-url.com' // Replace with your actual backend URL when deployed
        : 'http://localhost:5047',
    endpoints: {
        register: '/api/users/register',
        randomDestination: '/api/game/random-destination',
        checkAnswer: '/api/game/check-answer',
        getByInviteCode: '/api/users/by-invite-code'
    }
};

export default config; 