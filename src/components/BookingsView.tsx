import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/DemoAuthContext';

interface BookingRequest {
  id: string;
  bookerName: string;
  bookerUid: string;
  providerName: string;
  providerUid: string;
  requestedDateTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  skill: string;
}

const BookingsView: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = () => {
    if (!user) return;
    
    const allBookings = JSON.parse(localStorage.getItem('skill-link-bookings') || '[]');
    const userBookings = allBookings.filter((booking: BookingRequest) => 
      booking.bookerUid === user.uid || booking.providerUid === user.uid
    );
    setBookings(userBookings);
  };

  const updateBookingStatus = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    const allBookings = JSON.parse(localStorage.getItem('skill-link-bookings') || '[]');
    const updatedBookings = allBookings.map((booking: BookingRequest) => {
      if (booking.id === bookingId) {
        return { ...booking, status: newStatus };
      }
      return booking;
    });
    localStorage.setItem('skill-link-bookings', JSON.stringify(updatedBookings));
    loadBookings();
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Please log in to view bookings</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ color: 'var(--loyal-blue)', marginBottom: '20px' }}>📅 My Bookings</h3>
      
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          <p>No bookings yet</p>
          <p style={{ fontSize: '0.9rem' }}>Book sessions with other users to see them here!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              backgroundColor: '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--loyal-blue)' }}>
                    {booking.bookerUid === user?.uid ? 
                      `Session with ${booking.providerName}` : 
                      `Booking from ${booking.bookerName}`
                    }
                  </h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Skill:</strong> {booking.skill}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Requested Time:</strong> {booking.requestedDateTime}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Created:</strong> {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <div style={{
                    padding: '5px 15px',
                    borderRadius: '20px',
                    backgroundColor: booking.status === 'pending' ? '#fff3cd' : 
                                   booking.status === 'confirmed' ? '#d4edda' : '#f8d7da',
                    color: booking.status === 'pending' ? '#856404' : 
                           booking.status === 'confirmed' ? '#155724' : '#721c24',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                  
                  {booking.providerUid === user?.uid && booking.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsView;