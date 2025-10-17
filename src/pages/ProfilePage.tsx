import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/MockAuthContext';

const ProfilePage: React.FC = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    skills: '',
    wantToLearn: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        skills: userProfile.skills?.join(', ') || '',
        wantToLearn: userProfile.wantToLearn?.join(', ') || ''
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updatedProfile = {
        displayName: formData.displayName,
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        wantToLearn: formData.wantToLearn.split(',').map(s => s.trim()).filter(s => s)
      };

      await updateUserProfile(updatedProfile);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        skills: userProfile.skills?.join(', ') || '',
        wantToLearn: userProfile.wantToLearn?.join(', ') || ''
      });
    }
    setIsEditing(false);
    setMessage('');
  };

  const handleImageUpload = () => {
    alert('Profile picture upload feature would be implemented here with Firebase Storage');
  };

  // Sample statistics - in production this would come from your MySQL database
  const stats = {
    sessionsCompleted: 12,
    skillsShared: 3,
    skillsLearned: 2,
    rating: 4.8,
    joinDate: new Date('2024-01-15')
  };

  return (
    <div className="page">
      <h2 style={{ color: 'var(--loyal-blue)', marginBottom: '30px', textAlign: 'center' }}>
        Your Profile
      </h2>

      {message && (
        <div style={{
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: message.includes('Error') ? 'var(--error-red)' : 'var(--success-green)',
          border: `1px solid ${message.includes('Error') ? 'var(--error-red)' : 'var(--success-green)'}`
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 2fr' }}>
        {/* Profile Picture and Basic Info */}
        <div className="card">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: 'var(--loyal-blue)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: 'bold',
              margin: '0 auto 20px auto',
              border: '4px solid var(--loyal-blue)',
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={handleImageUpload}
            >
              {userProfile?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                backgroundColor: 'var(--white)',
                color: 'var(--loyal-blue)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                border: '2px solid var(--loyal-blue)'
              }}>
                📷
              </div>
            </div>
            
            <h3 style={{ color: 'var(--loyal-blue)', marginBottom: '5px' }}>
              {userProfile?.displayName || 'User'}
            </h3>
            <p style={{ color: 'var(--dark-gray)', marginBottom: '20px' }}>
              {user?.email}
            </p>

            {/* Status */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div className="status-indicator online"></div>
              <span style={{ color: 'var(--success-green)', fontWeight: 'bold' }}>Online</span>
            </div>

            {/* Quick Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px',
              textAlign: 'center'
            }}>
              <div style={{ 
                padding: '15px',
                backgroundColor: 'var(--light-gray)',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  color: 'var(--loyal-blue)'
                }}>
                  {stats.sessionsCompleted}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--dark-gray)' }}>
                  Sessions
                </div>
              </div>
              <div style={{ 
                padding: '15px',
                backgroundColor: 'var(--light-gray)',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  color: 'var(--loyal-blue)'
                }}>
                  ⭐ {stats.rating}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--dark-gray)' }}>
                  Rating
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--dark-gray)' }}>
              Member since {stats.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: 'var(--loyal-blue)', margin: 0 }}>Profile Information</h3>
            {!isEditing ? (
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : '💾 Save'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Your display name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">About Me</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself, your interests, and what makes you a great learning partner..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">Skills I Can Teach</label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="List your skills separated by commas (e.g., English, Guitar, Programming, Cooking)"
                  rows={3}
                />
                <small style={{ color: 'var(--dark-gray)' }}>
                  Separate skills with commas
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="wantToLearn">Skills I Want to Learn</label>
                <textarea
                  id="wantToLearn"
                  name="wantToLearn"
                  value={formData.wantToLearn}
                  onChange={handleInputChange}
                  placeholder="What would you like to learn? (e.g., Spanish, Piano, Photography, Cooking)"
                  rows={3}
                />
                <small style={{ color: 'var(--dark-gray)' }}>
                  Separate skills with commas
                </small>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: 'var(--loyal-blue)', marginBottom: '10px' }}>About Me</h4>
                <p style={{ 
                  color: 'var(--dark-gray)', 
                  lineHeight: 1.6,
                  backgroundColor: 'var(--light-gray)',
                  padding: '15px',
                  borderRadius: '8px',
                  minHeight: '60px'
                }}>
                  {userProfile?.bio || 'No bio added yet. Click "Edit Profile" to add information about yourself!'}
                </p>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: 'var(--loyal-blue)', marginBottom: '10px' }}>
                  🎓 Skills I Can Teach
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {userProfile?.skills && userProfile.skills.length > 0 ? (
                    userProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: 'var(--loyal-blue)',
                          color: 'var(--white)',
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p style={{ color: 'var(--dark-gray)', fontStyle: 'italic' }}>
                      No skills listed yet
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: 'var(--loyal-blue)', marginBottom: '10px' }}>
                  📚 Skills I Want to Learn
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {userProfile?.wantToLearn && userProfile.wantToLearn.length > 0 ? (
                    userProfile.wantToLearn.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: 'var(--light-gray)',
                          color: 'var(--loyal-blue)',
                          border: '2px solid var(--loyal-blue)',
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p style={{ color: 'var(--dark-gray)', fontStyle: 'italic' }}>
                      No learning interests listed yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Learning Statistics */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ color: 'var(--loyal-blue)', marginBottom: '20px' }}>📊 Learning Statistics</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{ 
            textAlign: 'center',
            padding: '20px',
            backgroundColor: 'var(--light-gray)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              color: 'var(--loyal-blue)',
              marginBottom: '5px'
            }}>
              {stats.sessionsCompleted}
            </div>
            <div style={{ color: 'var(--dark-gray)' }}>Sessions Completed</div>
          </div>

          <div style={{ 
            textAlign: 'center',
            padding: '20px',
            backgroundColor: 'var(--light-gray)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏆</div>
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              color: 'var(--loyal-blue)',
              marginBottom: '5px'
            }}>
              {stats.skillsShared}
            </div>
            <div style={{ color: 'var(--dark-gray)' }}>Skills Shared</div>
          </div>

          <div style={{ 
            textAlign: 'center',
            padding: '20px',
            backgroundColor: 'var(--light-gray)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📖</div>
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              color: 'var(--loyal-blue)',
              marginBottom: '5px'
            }}>
              {stats.skillsLearned}
            </div>
            <div style={{ color: 'var(--dark-gray)' }}>Skills Learned</div>
          </div>

          <div style={{ 
            textAlign: 'center',
            padding: '20px',
            backgroundColor: 'var(--light-gray)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⭐</div>
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              color: 'var(--loyal-blue)',
              marginBottom: '5px'
            }}>
              {stats.rating}/5.0
            </div>
            <div style={{ color: 'var(--dark-gray)' }}>Average Rating</div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="card" style={{ 
        marginTop: '20px',
        backgroundColor: 'var(--light-gray)',
        border: '1px solid var(--border-color)'
      }}>
        <h4 style={{ color: 'var(--loyal-blue)', marginBottom: '15px' }}>💡 Profile Tips</h4>
        <ul style={{ color: 'var(--dark-gray)', lineHeight: 1.6 }}>
          <li>🖼️ <strong>Upload a profile picture</strong> - profiles with pictures get 3x more connections!</li>
          <li>📝 <strong>Write a detailed bio</strong> - tell people about your teaching style and learning goals</li>
          <li>🎯 <strong>List specific skills</strong> - be precise about what you can teach (e.g., "Beginner Guitar" vs just "Music")</li>
          <li>⭐ <strong>Stay active</strong> - regular sessions and positive reviews improve your rating</li>
          <li>💬 <strong>Respond quickly</strong> - fast response times lead to more successful matches</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;