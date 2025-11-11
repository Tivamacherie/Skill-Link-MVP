import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/DemoAuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/home'); // Redirect to home page after successful login
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--loyal-blue)', marginBottom: '10px' }}>Skill-Link</h1>
          <h2 style={{ color: 'var(--loyal-blue)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--dark-gray)' }}>Sign in to continue your learning journey</p>
        </div>

        {error && (
          <div style={{ 
            color: 'var(--error-red)', 
            textAlign: 'center', 
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '5px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            color: '#2e7d2e', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            🎉 <strong>Demo Mode:</strong> Try it now!<br/>
            📧 sarah.teacher@demo.com | 🔑 123456<br/>
            📧 mike.guitar@demo.com | 🔑 123456
          </div>
          <p style={{ color: 'var(--dark-gray)' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: 'var(--loyal-blue)', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;