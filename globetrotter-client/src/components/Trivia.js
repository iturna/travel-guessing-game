import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Trivia.css';

const Trivia = ({ trivia }) => {
  if (!trivia || trivia.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="trivia-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Interesting Facts</h3>
      <ul className="trivia-list">
        {trivia.map((fact, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="trivia-item"
          >
            {fact}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Trivia; 