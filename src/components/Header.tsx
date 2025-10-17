import React from 'react';
import { useAuth } from '../context/MockAuthContext';

const Header: React.FC = () => {
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Skill-Link</h1>
        <div className="user-info">
          {userProfile && (
            <>
              <span>Hello, {userProfile.displayName || user?.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;