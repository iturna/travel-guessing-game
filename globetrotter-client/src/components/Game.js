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
import Clues from './Clues';
import SadFace from './SadFace';
import DestinationDetails from './DestinationDetails';
import Trivia from './Trivia';

const Game = () => {
  const [searchParams] = useSearchParams();
  const [currentDestination, setCurrentDestination] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [funFact, setFunFact] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSadFace, setShowSadFace] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [invitedBy, setInvitedBy] = useState(null);
  const [destinationDetails, setDestinationDetails] = useState(null);
  const [trivia, setTrivia] = useState([]);

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
    setTrivia([]);
    setError(null);
    setShowSadFace(false);
    setDestinationDetails(null);
    
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

  const handleAnswer = async (answerId) => {
    if (answered) return;
    
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}${config.endpoints.checkAnswer}`,
        {
          destinationId: currentDestination.id,
          answerId: answerId
        }
      );

      setAnswered(true);

      if (response.data.isCorrect) {
        setScore(prev => prev + 1);
        setCorrectAnswers(prev => prev + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setIncorrectAnswers(prev => prev + 1);
        setShowSadFace(true);
        setTimeout(() => setShowSadFace(false), 3000);
      }

      setFunFact(response.data.funFact);
      setTrivia(response.data.trivia);
      setDestinationDetails({
        isCorrect: response.data.isCorrect,
        correctCity: response.data.correctCity,
        country: response.data.country,
        funFact: response.data.funFact,
        trivia: response.data.trivia,
        correctAnswers: response.data.isCorrect ? correctAnswers + 1 : correctAnswers,
        incorrectAnswers: !response.data.isCorrect ? incorrectAnswers + 1 : incorrectAnswers
      });
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
        className="score-board"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="score-total">Score: {score}</div>
        <div className="score-details">
          <span className="correct-answers">✓ {correctAnswers}</span>
          <span className="incorrect-answers">✗ {incorrectAnswers}</span>
        </div>
      </motion.div>
      
      <div className="options">
        {currentDestination && !destinationDetails && (
          <div className="game-content">
            <Clues clues={currentDestination.clues} />
            
            <CityOptions 
              options={currentDestination.options} 
              onAnswer={handleAnswer} 
              disabled={answered}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {destinationDetails && (
          <DestinationDetails 
            isCorrect={destinationDetails.isCorrect}
            correctCity={destinationDetails.correctCity}
            country={destinationDetails.country}
            funFact={destinationDetails.funFact}
            trivia={destinationDetails.trivia}
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
            onNextDestination={fetchNewDestination}
          />
        )}
      </AnimatePresence>

      {showSadFace && <SadFace />}

      {user && (
        <ShareGame 
          score={score}
          username={user.username}
          inviteCode={user.inviteCode}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
        />
      )}
    </div>
  );
};

export default Game;
