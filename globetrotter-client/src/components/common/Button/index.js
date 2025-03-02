import React from 'react';
import { motion } from 'framer-motion';
import './styles.css';

const Button = ({ 
    children, 
    onClick, 
    className = '', 
    disabled = false,
    type = 'button',
    variant = 'primary'
}) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`custom-button ${variant} ${className}`}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
        >
            {children}
        </motion.button>
    );
};

export default Button; 