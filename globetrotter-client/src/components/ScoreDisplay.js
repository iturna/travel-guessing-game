import React from 'react';

function ScoreDisplay({ score }) {
    return (
        <div className="score-container">
            <h3>Score: {score}</h3>
        </div>
    );
}

export default ScoreDisplay; 