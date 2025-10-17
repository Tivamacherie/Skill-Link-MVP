import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loader">
        <h1>Skill-Link</h1>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;