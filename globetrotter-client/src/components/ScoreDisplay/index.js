import React from 'react';
import './styles.css';

const ScoreDisplay = ({ score, correctAnswers, incorrectAnswers }) => {
    return (
        <div className="score-display">
            <div className="score-item">
                <span className="score-label">Score:</span>
                <span className="score-value">{score}</span>
            </div>
            {correctAnswers !== undefined && (
                <div className="score-item">
                    <span className="score-label">Correct:</span>
                    <span className="score-value correct">{correctAnswers}</span>
                </div>
            )}
            {incorrectAnswers !== undefined && (
                <div className="score-item">
                    <span className="score-label">Incorrect:</span>
                    <span className="score-value incorrect">{incorrectAnswers}</span>
                </div>
            )}
        </div>
    );
};

export default ScoreDisplay; 