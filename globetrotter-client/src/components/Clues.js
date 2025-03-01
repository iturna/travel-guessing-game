import React from 'react';
import { motion } from 'framer-motion';

const Clues = ({ clues }) => {
  return (
    <div className="clues-container">
      {clues.map((clue, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="clue"
        >
          {clue}
        </motion.p>
      ))}
    </div>
  );
};

export default Clues; 