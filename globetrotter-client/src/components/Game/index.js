import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CityOptions from '../CityOptions';
import ScoreDisplay from '../ScoreDisplay';
import ShareGame from '../ShareGame';
import Button from '../common/Button';
import config from '../../config';
import './styles.css';

const Game = ({ user }) => {
    const [currentDestination, setCurrentDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [funFact, setFunFact] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSadFace, setShowSadFace] = useState(false);
    const [trivia, setTrivia] = useState([]);
    const [correctCity, setCorrectCity] = useState('');
    const [correctCountry, setCorrectCountry] = useState('');
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(true);
    const [showShareGame, setShowShareGame] = useState(false);

    const fetchDestination = async () => {
        try {
            setLoading(true);
            setError('');
            setAnswered(false);
            setFunFact('');
            setTrivia([]);
            
            const response = await axios.get(
                `${config.apiBaseUrl}${config.endpoints.randomDestination}`
            );
            
            setCurrentDestination(response.data);
            setGameInProgress(true);
        } catch (error) {
            console.error('Error fetching destination:', error);
            setError('Failed to load destination. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestination();
    }, []);

    useEffect(() => {
        console.log("Checking share game visibility:", correctAnswers, incorrectAnswers);
        if (correctAnswers + incorrectAnswers >= 5) {
            console.log("Should show share game now");
            setShowShareGame(true);
            setGameInProgress(false);
        }
    }, [correctAnswers, incorrectAnswers]);

    const handleAnswer = async (answerId) => {
        if (answered) return;
        
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}${config.endpoints.checkAnswer}`,
                {
                    destinationId: currentDestination.id,
                    answerId
                }
            );

            setAnswered(true);
            setCorrectCity(response.data.correctCity);
            setCorrectCountry(response.data.country);
            setIsCorrectAnswer(response.data.isCorrect);

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
            setTrivia(response.data.trivia || []);
            
            // Check if we should show the share button
            const newTotalAnswers = correctAnswers + incorrectAnswers + 1;
            console.log("Total answers after this one:", newTotalAnswers);
            if (newTotalAnswers >= 5) {
                console.log("Setting game in progress to false");
                setGameInProgress(false);
                setShowShareGame(true);
            }
        } catch (error) {
            console.error('Error checking answer:', error);
            setError('Failed to check answer. Please try again.');
        }
    };

    const handleNextDestination = () => {
        fetchDestination();
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <Button onClick={fetchDestination}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="game-container">
            <ScoreDisplay 
                score={score} 
                correctAnswers={correctAnswers} 
                incorrectAnswers={incorrectAnswers} 
            />
            
            <div className="clues-container">
                <h3>Clues:</h3>
                <ul>
                    {currentDestination?.clues.map((clue, index) => (
                        <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            {clue}
                        </motion.li>
                    ))}
                </ul>
            </div>
            
            <h3>Which city is this?</h3>
            <CityOptions 
                options={currentDestination?.options || []} 
                onAnswer={handleAnswer} 
                disabled={answered} 
            />
            
            <AnimatePresence>
                {answered && (
                    <motion.div
                        className="fun-fact"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {!isCorrectAnswer && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="correct-answer"
                            >
                                The correct answer was: <strong>{correctCity}, {correctCountry}</strong>
                            </motion.p>
                        )}
                        <p>{funFact}</p>
                        <div className="next-button-container">
                            <Button
                                onClick={fetchDestination}
                                variant="primary"
                            >
                                Next Destination
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {trivia.length > 0 && (
                    <motion.div
                        className="trivia-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <h3>Interesting Facts:</h3>
                        <ul>
                            {trivia.map((item, index) => (
                                <motion.li 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <div 
                            key={i}
                            className="confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
                            }}
                        />
                    ))}
                </div>
            )}
            
            {showSadFace && (
                <div className="sad-face-container">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="sad-face"
                            initial={{ 
                                opacity: 1, 
                                y: -50,
                                x: Math.random() * window.innerWidth
                            }}
                            animate={{ 
                                opacity: 0,
                                y: window.innerHeight / 2
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
            
            {showShareGame && (
                <motion.div 
                    className="share-game-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        marginTop: '30px',
                        padding: '20px',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '2px solid #25d366'
                    }}
                >
                    <ShareGame 
                        score={score}
                        username={user?.username}
                        inviteCode={user?.inviteCode}
                        correctAnswers={correctAnswers}
                        incorrectAnswers={incorrectAnswers}
                    />
                </motion.div>
            )}
            
            {/* Debug info - remove in production */}
            <div style={{display: 'none'}}>
                <p>Debug: correctAnswers={correctAnswers}, incorrectAnswers={incorrectAnswers}</p>
                <p>Debug: showShareGame={showShareGame.toString()}, gameInProgress={gameInProgress.toString()}</p>
            </div>
        </div>
    );
};

export default Game; 