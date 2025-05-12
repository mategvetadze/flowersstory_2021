import React, { useState, useEffect } from 'react';
import './AuthImagePattern.css';

const AuthImagePattern = ({ title, subtitle }) => {
  const [glowingIndices, setGlowingIndices] = useState([]);

  useEffect(() => {
    const randomizeGlow = () => {
      const randomOrder = [...Array(9).keys()].sort(() => Math.random() - 0.5);
      setGlowingIndices(randomOrder); 
    };

    randomizeGlow();
    const interval = setInterval(randomizeGlow, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="auth-pattern-container">
      <div className="auth-pattern-content">
        <div className="pattern-grid">
          {
            [...Array(9)].map((_, index) => (
              <div
                key={index}
                className={`pattern-box ${glowingIndices.includes(index) ? 'animate-pulse' : ''}`}
                style={{ animationDelay: `${index * 0.3}s` }}
              ></div>
            ))
          }
        </div>
        <h2 className="auth-pattern-title">{title}</h2>
        <p className="auth-pattern-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
