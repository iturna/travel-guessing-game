import React from 'react';
import './styles.css';

const CityOptions = ({ options, onAnswer, disabled }) => {
    return (
        <div className="city-options-grid">
            {options.map((city) => (
                <button
                    key={city.id}
                    onClick={() => onAnswer(city.id)}
                    disabled={disabled}
                    className="city-option"
                >
                    {city.name}
                </button>
            ))}
        </div>
    );
};

export default CityOptions; 