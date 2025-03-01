import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfile from './UserProfile';
import ShareGame from './ShareGame';
import { useSearchParams } from 'react-router-dom';
import config from '../config';
import './Game.css';
import CityOptions from './CityOptions';

const Game = () => {
  const [searchParams] = useSearchParams();
  const [currentDestination, setCurrentDestination] = useState(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [funFact, setFunFact] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSadFace, setShowSadFace] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [invitedBy, setInvitedBy] = useState(null);

  useEffect(() => {
    const inviteCode = searchParams.get('inviteCode');
    if (inviteCode) {
      // Fetch username by invite code
      axios.get(`${config.apiBaseUrl}/api/users/by-invite-code/${inviteCode}`)
        .then(response => {
          setInvitedBy(response.data);
        })
        .catch(error => {
          console.error('Error fetching inviter:', error);
        });
    }
  }, [searchParams]);

  const handleRegister = async (userData) => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}${config.endpoints.register}`, 
        { username: userData.username }
      );
      
      setUser(response.data);
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // This will be caught by UserProfile component
    }
  };

  const fetchNewDestination = async () => {
    setLoading(true);
    setAnswered(false);
    setFunFact('');
    setError(null);
    setShowSadFace(false);
    
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}${config.endpoints.randomDestination}`,
        { timeout: 5000 } // Add timeout to prevent infinite loading
      );
      
      if (!response.data) {
        throw new Error('No destination data received');
      }
      
      setCurrentDestination(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching destination:', error);
      setError('Failed to load destination. Please try again.');
      setCurrentDestination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (answered) return;
    
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}${config.endpoints.checkAnswer}`,
        {
          destinationId: currentDestination.id,
          answer
        }
      );

      setAnswered(true);

      if (response.data.isCorrect) {
        setScore(prev => prev + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setShowSadFace(true);
        setTimeout(() => setShowSadFace(false), 3000);
      }

      setFunFact(response.data.funFact);
    } catch (error) {
      console.error('Error checking answer:', error);
      setError('Failed to check answer. Please try again.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchNewDestination();
    }
  }, [user]);

  if (!user) {
    return <UserProfile onRegister={handleRegister} invitedBy={invitedBy} />;
  }

  if (loading) {
    return (
      <div className="loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="loading-spinner"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <motion.p 
          className="error-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
        <motion.button 
          onClick={fetchNewDestination}
          className="retry-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="game-container">
      {showConfetti && <Confetti />}
      <motion.div 
        className="score"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Score: {score}
      </motion.div>
      
      <div className="clues">
        {currentDestination?.clues.map((clue, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            {clue}
          </motion.p>
        ))}
      </div>

      <div className="options">
        <CityOptions 
          options={currentDestination?.options || []} 
          onSelect={handleAnswer}
        />
      </div>

      <AnimatePresence>
        {funFact && (
          <motion.div
            className="fun-fact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p>{funFact}</p>
            <motion.button
              className="next-button"
              onClick={fetchNewDestination}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Destination
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {showSadFace && (
        <div className="sad-faces-container">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="sad-face"
              initial={{ 
                opacity: 1, 
                y: -50,
                x: Math.random() * window.innerWidth
              }}
              animate={{ 
                y: window.innerHeight + 50,
                opacity: 0
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                ease: "linear"
              }}
            >
              😢
            </motion.div>
          ))}
        </div>
      )}

      {user && (
        <ShareGame 
          score={score} 
          username={user.username}
          inviteCode={user.inviteCode}
        />
      )}
    </div>
  );
};

export default Game;
