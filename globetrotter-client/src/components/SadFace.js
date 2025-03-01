import React from 'react';
import { motion } from 'framer-motion';

const SadFace = () => {
  return (
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
  );
};

export default SadFace; 