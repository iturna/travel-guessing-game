import React from 'react';

function CityOptions({ options, onSelect }) {
    return (
        <div className="options-grid">
            {options.map((city, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(city)}
                    className="city-option"
                >
                    {city}
                </button>
            ))}
        </div>
    );
}

export default CityOptions; 