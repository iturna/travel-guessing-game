import React from 'react';

function ClueList({ clues }) {
    return (
        <div className="clues-container">
            <h2>Clues</h2>
            <ul>
                {clues.map((clue, index) => (
                    <li key={index}>{clue}</li>
                ))}
            </ul>
        </div>
    );
}

export default ClueList; 