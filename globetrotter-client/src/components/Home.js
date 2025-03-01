import React, { useState } from 'react';
import config from '../config';

function Home() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    console.log('Register button clicked');
    console.log('API URL:', `${config.apiBaseUrl}${config.endpoints.register}`);
    
    try {
      // This is where the API call should be made
      const response = await fetch(`${config.apiBaseUrl}${config.endpoints.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Handle successful registration
      console.log('Registration successful:', data);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h1>Welcome to Globetrotter!</h1>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Enter Your Username to Start" 
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleRegister}>Start Playing</button>
    </div>
  );
}

export default Home; 