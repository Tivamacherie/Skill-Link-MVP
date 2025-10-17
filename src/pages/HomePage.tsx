import React, { useState } from 'react';
import { useAuth, MOCK_USERS } from '../context/MockAuthContext';

// Convert mock users to sample format
const sampleUsers = MOCK_USERS.map(user => ({
  id: parseInt(user.uid),
  name: user.profile.displayName,
  skills: user.profile.skills,
  wantToLearn: user.profile.wantToLearn,
  isOnline: user.profile.isOnline,
  bio: user.profile.bio
}));

const sampleAppointments = [
  { id: 1, date: '2025-10-20', time: '14:00', partner: 'Martin', details: 'English conversation & guitar lesson exchange' },
  { id: 2, date: '2025-10-22', time: '16:30', partner: 'Maria', details: 'Guitar fundamentals for beginners' }
];

const HomePage: React.FC = () => {
  const { userProfile } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Generate calendar for current month
  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasAppointment = sampleAppointments.some(apt => apt.date === dateString);
      const isToday = day === today.getDate();
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasAppointment ? 'has-appointment' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => {
            setSelectedDate(dateString);
            setShowAppointmentModal(true);
          }}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="page">
      <h2 style={{ color: 'var(--loyal-blue)', marginBottom: '30px', textAlign: 'center' }}>
        Welcome back, {userProfile?.displayName}!
      </h2>

      {/* Online Users Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Your Matches Online</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {sampleUsers.map(user => (
            <div key={user.id} className="card" style={{ 
              minWidth: '200px', 
              flex: '1 1 calc(50% - 15px)',
              cursor: 'pointer',
              padding: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`}></div>
                <div>
                  <h4 style={{ color: 'var(--loyal-blue)', margin: '0' }}>{user.name}</h4>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--dark-gray)' }}>
                    <strong>Skills:</strong> {user.skills.join(', ')}
                  </p>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--dark-gray)' }}>
                    <strong>Learning:</strong> {user.wantToLearn.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Calendar</h3>
          <p style={{ color: 'var(--dark-gray)', margin: '0' }}>
            Click on a date to schedule an appointment
          </p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '5px',
            marginBottom: '10px'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ 
                textAlign: 'center', 
                fontWeight: 'bold', 
                color: 'var(--loyal-blue)',
                padding: '10px'
              }}>
                {day}
              </div>
            ))}
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '5px'
          }}>
            {generateCalendar()}
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          fontSize: '0.9rem',
          color: 'var(--dark-gray)',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '15px', 
              height: '15px', 
              backgroundColor: '#FFE082', 
              borderRadius: '3px' 
            }}></div>
            <span>Has Appointment</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '15px', 
              height: '15px', 
              backgroundColor: 'var(--loyal-blue)', 
              borderRadius: '3px' 
            }}></div>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Upcoming Appointments</h3>
        </div>
        {sampleAppointments.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--dark-gray)' }}>
            No upcoming appointments
          </p>
        ) : (
          <div>
            {sampleAppointments.map(appointment => (
              <div key={appointment.id} className="card" style={{ 
                backgroundColor: 'var(--light-gray)',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ color: 'var(--loyal-blue)', margin: '0 0 10px 0' }}>
                  Session with {appointment.partner}
                </h4>
                <p style={{ margin: '5px 0', color: 'var(--dark-gray)' }}>
                  <strong>📅 Date:</strong> {formatDate(appointment.date)}
                </p>
                <p style={{ margin: '5px 0', color: 'var(--dark-gray)' }}>
                  <strong>⏰ Time:</strong> {appointment.time}
                </p>
                <p style={{ margin: '5px 0', color: 'var(--dark-gray)' }}>
                  <strong>📝 Details:</strong> {appointment.details}
                </p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                    Join Call
                  </button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="modal-overlay" onClick={() => setShowAppointmentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowAppointmentModal(false)}
            >
              ×
            </button>
            <h3 style={{ color: 'var(--loyal-blue)', textAlign: 'center', marginBottom: '20px' }}>
              Schedule Appointment
            </h3>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--dark-gray)' }}>
              Selected Date: {selectedDate ? formatDate(selectedDate) : ''}
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Appointment booking feature will be implemented with MySQL backend');
              setShowAppointmentModal(false);
            }}>
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input type="time" id="time" required />
              </div>
              <div className="form-group">
                <label htmlFor="partner">Partner</label>
                <select id="partner" required>
                  <option value="">Select a partner</option>
                  {sampleUsers.map(user => (
                    <option key={user.id} value={user.name}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="details">Session Details</label>
                <textarea 
                  id="details" 
                  placeholder="What will you be learning/teaching in this session?"
                  rows={3}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Book Appointment
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAppointmentModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .calendar-day {
          aspect-ratio: 1;
          border: 2px solid var(--loyal-blue);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: var(--white);
          color: var(--loyal-blue);
          font-weight: bold;
          transition: all 0.3s;
          min-height: 40px;
        }
        
        .calendar-day:hover {
          background-color: var(--loyal-blue);
          color: var(--white);
          transform: scale(1.05);
        }
        
        .calendar-day.empty {
          border: none;
          cursor: default;
        }
        
        .calendar-day.empty:hover {
          background-color: transparent;
          transform: none;
        }
        
        .calendar-day.has-appointment {
          background-color: #FFE082;
        }
        
        .calendar-day.today {
          background-color: var(--loyal-blue);
          color: var(--white);
        }
        
        .calendar-day.today.has-appointment {
          background: linear-gradient(45deg, var(--loyal-blue) 50%, #FFE082 50%);
        }
      `}</style>
    </div>
  );
};

export default HomePage;