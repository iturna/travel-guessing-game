import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UserProfile = ({ onRegister, invitedBy }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    try {
      await onRegister({ username });
    } catch (error) {
      setError(error.response?.data || 'Registration failed');
    }
  };

  return (
    <motion.div 
      className="user-profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Welcome to Globetrotter!</h2>
      {invitedBy && (
        <p className="invited-by">You were invited by {invitedBy}</p>
      )}
      <h3>Enter Your Username to Start</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="username-input"
        />
        {error && <p className="error">{error}</p>}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="start-button"
        >
          Start Playing
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UserProfile; 