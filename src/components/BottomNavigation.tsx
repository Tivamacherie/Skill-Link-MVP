import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/search', icon: '🔍', label: 'Search' },
    { path: '/chat', icon: '💬', label: 'Chat' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;