// components/buttonSection/ButtonSection.js

import React, { useEffect, useRef } from 'react';
import './style.scss';

const ButtonSection = ({ genresData, selectedGenre, onChange }) => {
    const buttonSectionRef = useRef(null);

    const handleButtonClick = (genre) => {
        if (selectedGenre && selectedGenre.id === genre.id) {
            onChange(null, { name: 'genres' });
        } else {
            onChange(genre, { name: 'genres' });
        }
    };

    useEffect(() => {
        if (buttonSectionRef.current) {
            buttonSectionRef.current.scrollLeft = 0; // Scroll to the start
        }
    }, [genresData]);

    return (
        <div className="button-section" ref={buttonSectionRef}>
            {genresData?.genres?.map((genre) => (
                <button
                    key={genre.id}
                    className={`genre-button ${selectedGenre && selectedGenre.id === genre.id ? 'selected' : ''}`}
                    onClick={() => handleButtonClick(genre)}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
};

export default ButtonSection;
