import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../context/DemoAuthContext';

const SearchPage: React.FC = () => {
  const { userProfile, searchUsers, getAllUsers } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await getAllUsers();
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    try {
      setLoading(true);
      const users = await searchUsers(query);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchInfo = (user: UserProfile) => {
    if (!userProfile) return null;

    const mySkills = userProfile.skills.map(s => s.toLowerCase());
    const myWants = userProfile.wantToLearn.map(s => s.toLowerCase());
    const theirSkills = user.skills.map(s => s.toLowerCase());
    const theirWants = user.wantToLearn.map(s => s.toLowerCase());

    // Find mutual teaching opportunities
    const iCanTeach = mySkills.filter(skill => theirWants.includes(skill));
    const theyCanTeach = theirSkills.filter(skill => myWants.includes(skill));

    if (iCanTeach.length > 0 && theyCanTeach.length > 0) {
      return {
        type: 'perfect',
        message: `Perfect Match! You can teach ${iCanTeach.join(', ')} and learn ${theyCanTeach.join(', ')}`
      };
    } else if (iCanTeach.length > 0) {
      return {
        type: 'teach',
        message: `You can help them with: ${iCanTeach.join(', ')}`
      };
    } else if (theyCanTeach.length > 0) {
      return {
        type: 'learn',
        message: `They can help you with: ${theyCanTeach.join(', ')}`
      };
    }

    return null;
  };

  const handleConnect = (user: any) => {
    alert(`Connection request sent to ${user.displayName}! They will be notified and can respond to start chatting.`);
  };

  const handleBookSession = (user: any) => {
    alert(`Opening booking calendar for ${user.displayName}. This will connect to the appointment system.`);
  };

  return (
    <div className="page">
      <h2 style={{ color: 'var(--loyal-blue)', marginBottom: '30px', textAlign: 'center' }}>
        Find Your Learning Partners
      </h2>

      {/* Search Bar */}
      <div className="card">
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by name, skill, or interest..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '15px 20px',
              border: '2px solid var(--loyal-blue)',
              borderRadius: '25px',
              outline: 'none',
              fontSize: '16px',
              color: 'var(--loyal-blue)'
            }}
          />
          <button 
            className="btn btn-primary"
            style={{
              marginLeft: '10px',
              borderRadius: '25px',
              padding: '15px 25px'
            }}
          >
            🔍
          </button>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px',
          fontSize: '0.9rem'
        }}>
          <span style={{ color: 'var(--dark-gray)' }}>Popular skills:</span>
          {['English', 'Guitar', 'Programming', 'French', 'Photography'].map(skill => (
            <button
              key={skill}
              onClick={() => handleSearch(skill)}
              style={{
                background: searchQuery === skill ? 'var(--loyal-blue)' : 'transparent',
                color: searchQuery === skill ? 'var(--white)' : 'var(--loyal-blue)',
                border: '1px solid var(--loyal-blue)',
                borderRadius: '15px',
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.3s'
              }}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 style={{ 
          color: 'var(--loyal-blue)', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {loading ? 'Searching...' : `${filteredUsers.length} ${filteredUsers.length === 1 ? 'Match' : 'Matches'} Found`}
        </h3>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h4 style={{ color: 'var(--loyal-blue)', marginBottom: '10px' }}>Loading users...</h4>
            <p style={{ color: 'var(--dark-gray)' }}>Please wait while we find matching users</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h4 style={{ color: 'var(--loyal-blue)', marginBottom: '10px' }}>No matches found</h4>
            <p style={{ color: 'var(--dark-gray)' }}>
              Try searching for different skills or browse all available users
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => handleSearch('')}
              style={{ marginTop: '20px' }}
            >
              Show All Users
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredUsers.map(user => {
              const matchInfo = getMatchInfo(user);
              return (
                <div key={user.uid} className="card" style={{ 
                  border: matchInfo?.type === 'perfect' ? '3px solid var(--success-green)' : undefined 
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--loyal-blue)',
                      color: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      backgroundImage: user.photoURL ? `url(${user.photoURL})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      overflow: 'hidden'
                    }}>
                      {!user.photoURL && user.displayName.charAt(0)}
                    </div>

                    {/* User Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <h3 style={{ color: 'var(--loyal-blue)', margin: 0 }}>{user.displayName}</h3>
                        <div className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`}></div>
                        <span style={{ 
                          fontSize: '0.9rem',
                          color: user.isOnline ? 'var(--success-green)' : 'var(--error-red)'
                        }}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>

                      <p style={{ color: 'var(--dark-gray)', marginBottom: '15px', lineHeight: 1.5 }}>
                        {user.bio}
                      </p>

                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <strong style={{ color: 'var(--loyal-blue)' }}>Can teach: </strong>
                          <span style={{ color: 'var(--dark-gray)' }}>
                            {user.skills.join(', ')}
                          </span>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--loyal-blue)' }}>Wants to learn: </strong>
                          <span style={{ color: 'var(--dark-gray)' }}>
                            {user.wantToLearn.join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Match Info */}
                      {matchInfo && (
                        <div style={{
                          padding: '10px 15px',
                          borderRadius: '8px',
                          marginBottom: '15px',
                          backgroundColor: matchInfo.type === 'perfect' 
                            ? '#e8f5e8' 
                            : matchInfo.type === 'teach' 
                              ? '#fff3e0' 
                              : '#e3f2fd',
                          border: `1px solid ${
                            matchInfo.type === 'perfect' 
                              ? 'var(--success-green)' 
                              : matchInfo.type === 'teach' 
                                ? '#ff9800' 
                                : '#2196f3'
                          }`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>
                              {matchInfo.type === 'perfect' ? '🎯' : matchInfo.type === 'teach' ? '🎓' : '📚'}
                            </span>
                            <span style={{ 
                              fontWeight: 'bold',
                              color: matchInfo.type === 'perfect' 
                                ? 'var(--success-green)' 
                                : 'var(--loyal-blue)'
                            }}>
                              {matchInfo.message}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleConnect(user)}
                          style={{ flex: '1', minWidth: '120px' }}
                        >
                          💬 Connect
                        </button>
                        <button 
                          className="btn btn-success"
                          onClick={() => handleBookSession(user)}
                          style={{ flex: '1', minWidth: '120px' }}
                        >
                          📅 Book Session
                        </button>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '12px' }}
                          title="View Profile"
                        >
                          👤
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="card" style={{ 
        marginTop: '30px',
        backgroundColor: 'var(--light-gray)',
        border: '1px solid var(--border-color)'
      }}>
        <h4 style={{ color: 'var(--loyal-blue)', marginBottom: '15px' }}>💡 Search Tips</h4>
        <ul style={{ color: 'var(--dark-gray)', lineHeight: 1.6 }}>
          <li>🎯 <strong>Perfect matches</strong> appear with green borders - these are users who can teach what you want to learn AND want to learn what you can teach!</li>
          <li>🔍 Search by specific skills like "guitar", "programming", or "french"</li>
          <li>👥 Use names to find specific people you've heard about</li>
          <li>⭐ Look for users with high compatibility scores for the best learning experience</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchPage;