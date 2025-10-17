import React, { useState } from 'react';

// Sample chat data - in production this would come from Firebase Firestore
const sampleChats = [
  {
    id: 1,
    userId: 1,
    name: 'Martin',
    lastMessage: 'See you tomorrow for our English session!',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: 1, text: 'Hi! Ready for tomorrow\'s session?', sent: false, timestamp: new Date(Date.now() - 600000) },
      { id: 2, text: 'Yes! Looking forward to learning guitar basics.', sent: true, timestamp: new Date(Date.now() - 400000) },
      { id: 3, text: 'Great! I\'ll bring my acoustic guitar. We can start with some basic chords.', sent: false, timestamp: new Date(Date.now() - 350000) },
      { id: 4, text: 'Perfect! And I\'ll help you with English conversation practice.', sent: true, timestamp: new Date(Date.now() - 320000) },
      { id: 5, text: 'See you tomorrow for our English session!', sent: false, timestamp: new Date(Date.now() - 300000) }
    ]
  },
  {
    id: 2,
    userId: 2,
    name: 'Maria',
    lastMessage: 'What time works best for you?',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: 1, text: 'Hi! I saw your profile and would love to help you with guitar!', sent: false, timestamp: new Date(Date.now() - 7400000) },
      { id: 2, text: 'That would be amazing! Thank you so much!', sent: true, timestamp: new Date(Date.now() - 7300000) },
      { id: 3, text: 'I can teach you piano fundamentals too if you\'re interested.', sent: false, timestamp: new Date(Date.now() - 7250000) },
      { id: 4, text: 'Yes please! I\'ve always wanted to learn piano.', sent: true, timestamp: new Date(Date.now() - 7220000) },
      { id: 5, text: 'What time works best for you?', sent: false, timestamp: new Date(Date.now() - 7200000) }
    ]
  },
  {
    id: 3,
    userId: 4,
    name: 'Sophie',
    lastMessage: 'Merci beaucoup! 🇫🇷',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 1, text: 'Bonjour! I can help you learn French cooking techniques!', sent: false, timestamp: new Date(Date.now() - 86500000) },
      { id: 2, text: 'That sounds wonderful! I\'d love to learn.', sent: true, timestamp: new Date(Date.now() - 86450000) },
      { id: 3, text: 'We can start with some basic French pastries. En échange, could you help me with programming?', sent: false, timestamp: new Date(Date.now() - 86420000) },
      { id: 4, text: 'Absolutely! I can teach you HTML, CSS, and JavaScript basics.', sent: true, timestamp: new Date(Date.now() - 86410000) },
      { id: 5, text: 'Merci beaucoup! 🇫🇷', sent: false, timestamp: new Date(Date.now() - 86400000) }
    ]
  }
];

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredChats = sampleChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    // Add new message to selected chat
    const updatedChat = {
      ...selectedChat,
      messages: [
        ...selectedChat.messages,
        {
          id: selectedChat.messages.length + 1,
          text: newMessage,
          sent: true,
          timestamp: new Date()
        }
      ],
      lastMessage: newMessage,
      timestamp: new Date()
    };

    setSelectedChat(updatedChat);
    setNewMessage('');

    // Simulate response after 1-2 seconds
    setTimeout(() => {
      const responses = [
        "That sounds great!",
        "I'm looking forward to it!",
        "Thanks for the message!",
        "Let me know when you're available.",
        "Perfect! See you then.",
        "I'll prepare some materials for our session.",
        "Great idea! That will work well."
      ];

      const response = {
        id: updatedChat.messages.length + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sent: false,
        timestamp: new Date()
      };

      setSelectedChat((prev: any) => ({
        ...prev,
        messages: [...prev.messages, response],
        lastMessage: response.text,
        timestamp: new Date()
      }));
    }, 1500);
  };

  const handleCall = (type: 'voice' | 'video') => {
    if (!selectedChat) return;
    
    const callType = type === 'voice' ? 'voice call' : 'video call';
    alert(`Starting ${callType} with ${selectedChat.name}...\n\nThis would integrate with WebRTC for real-time communication.`);
  };

  return (
    <div className="page">
      <h2 style={{ color: 'var(--loyal-blue)', marginBottom: '30px', textAlign: 'center' }}>
        Messages
      </h2>

      <div style={{ display: 'flex', gap: '20px', height: '70vh' }}>
        {/* Chat List */}
        <div style={{ 
          flex: selectedChat ? '0 0 350px' : '1',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Search */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid var(--loyal-blue)',
                borderRadius: '25px',
                outline: 'none',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Chat List */}
          <div className="card" style={{ 
            flex: 1, 
            padding: '0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '20px 20px 10px 20px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <h3 style={{ color: 'var(--loyal-blue)', margin: 0 }}>Conversations</h3>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredChats.length === 0 ? (
                <div style={{ 
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'var(--dark-gray)'
                }}>
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </div>
              ) : (
                filteredChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    style={{
                      padding: '15px 20px',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      backgroundColor: selectedChat?.id === chat.id ? 'var(--light-gray)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--loyal-blue)',
                      color: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      position: 'relative'
                    }}>
                      {chat.name.charAt(0)}
                      {chat.isOnline && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '12px',
                          height: '12px',
                          backgroundColor: 'var(--success-green)',
                          borderRadius: '50%',
                          border: '2px solid white'
                        }}></div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '5px'
                      }}>
                        <h4 style={{ 
                          color: 'var(--loyal-blue)', 
                          margin: 0,
                          fontSize: '1rem'
                        }}>
                          {chat.name}
                        </h4>
                        {chat.unreadCount > 0 && (
                          <span style={{
                            backgroundColor: 'var(--error-red)',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '2px 8px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <p style={{
                        color: 'var(--dark-gray)',
                        margin: 0,
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {chat.lastMessage}
                      </p>
                      <small style={{ color: 'var(--dark-gray)' }}>
                        {formatTime(chat.timestamp)}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className="card" style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '20px',
              borderBottom: '2px solid var(--loyal-blue)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--white)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--loyal-blue)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {selectedChat.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ color: 'var(--loyal-blue)', margin: 0 }}>
                    {selectedChat.name}
                  </h3>
                  <span style={{ 
                    fontSize: '0.9rem',
                    color: selectedChat.isOnline ? 'var(--success-green)' : 'var(--dark-gray)'
                  }}>
                    {selectedChat.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleCall('voice')}
                  className="btn btn-secondary"
                  style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px' }}
                  title="Voice Call"
                >
                  📞
                </button>
                <button
                  onClick={() => handleCall('video')}
                  className="btn btn-primary"
                  style={{ padding: '10px', borderRadius: '50%', width: '45px', height: '45px' }}
                  title="Video Call"
                >
                  📹
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              backgroundColor: 'var(--light-gray)',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {selectedChat.messages.map((message: any) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.sent ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      backgroundColor: message.sent ? 'var(--loyal-blue)' : 'var(--white)',
                      color: message.sent ? 'var(--white)' : 'var(--dark-gray)',
                      wordWrap: 'break-word',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <div>{message.text}</div>
                    <div style={{
                      fontSize: '0.75rem',
                      opacity: 0.8,
                      marginTop: '5px',
                      textAlign: 'right'
                    }}>
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form 
              onSubmit={handleSendMessage}
              style={{
                padding: '20px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--white)',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end'
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '25px',
                  outline: 'none',
                  fontSize: '16px',
                  resize: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!newMessage.trim()}
                style={{
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ➤
              </button>
            </form>
          </div>
        ) : (
          <div className="card" style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '40px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💬</div>
            <h3 style={{ color: 'var(--loyal-blue)', marginBottom: '10px' }}>
              Select a Conversation
            </h3>
            <p style={{ color: 'var(--dark-gray)' }}>
              Choose a conversation from the left to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;