import React from 'react';
import { motion } from 'framer-motion';

const DestinationDetails = ({ 
  isCorrect, 
  correctCity, 
  country, 
  funFact, 
  trivia, 
  correctAnswers,
  incorrectAnswers,
  onNextDestination 
}) => {
  return (
    <motion.div
      className="destination-details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
        {isCorrect ? 'Correct!' : 'Incorrect!'}
      </h2>
      
      <div className="destination-info">
        <h3>{correctCity}, {country}</h3>
      </div>
      
      <div className="score-summary">
        <div className="score-item correct">
          <span className="score-icon">✓</span>
          <span className="score-value">{correctAnswers}</span>
          <span className="score-label">Correct</span>
        </div>
        <div className="score-item incorrect">
          <span className="score-icon">✗</span>
          <span className="score-value">{incorrectAnswers}</span>
          <span className="score-label">Incorrect</span>
        </div>
      </div>
      
      <div className="fun-fact-container">
        <h4>Fun Fact</h4>
        <p>{funFact}</p>
      </div>
      
      {trivia && trivia.length > 0 && (
        <div className="trivia-container">
          <h4>Interesting Trivia</h4>
          <ul>
            {trivia.map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
      
      <motion.button
        className="next-button"
        onClick={onNextDestination}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Next Destination
      </motion.button>
    </motion.div>
  );
};

export default DestinationDetails; 