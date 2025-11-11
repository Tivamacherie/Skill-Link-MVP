import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/DemoAuthContext';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  participants: string[];
  otherUserName: string;
  messages: Message[];
  lastMessage?: string;
  lastMessageAt: Date;
}

const ChatPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = () => {
    if (!user) return;
    
    const stored = JSON.parse(localStorage.getItem('skill-link-conversations') || '[]');
    const userConversations = stored.filter((conv: any) => 
      conv.participants.includes(user.uid)
    ).map((conv: any) => ({
      ...conv,
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })),
      lastMessageAt: new Date(conv.lastMessageAt)
    }));
    
    setConversations(userConversations);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user || !userProfile) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      text: newMessage.trim(),
      senderId: user.uid,
      timestamp: new Date()
    };

    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: message.text,
      lastMessageAt: message.timestamp
    };

    setSelectedConversation(updatedConversation);
    
    const storedConversations = JSON.parse(localStorage.getItem('skill-link-conversations') || '[]');
    const updatedStored = storedConversations.map((conv: any) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, {
            ...message,
            timestamp: message.timestamp.toISOString()
          }],
          lastMessage: message.text,
          lastMessageAt: message.timestamp.toISOString()
        };
      }
      return conv;
    });
    localStorage.setItem('skill-link-conversations', JSON.stringify(updatedStored));
    
    setNewMessage('');
    loadConversations();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  if (!user) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: 'var(--loyal-blue)' }}>Please log in to access messages</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 style={{ color: 'var(--loyal-blue)', marginBottom: '20px', textAlign: 'center' }}>
        Messages
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '350px 1fr',
        gap: '20px',
        height: '600px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        {/* Conversations List */}
        <div style={{ 
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #ddd',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
            <h3 style={{ margin: 0, color: 'var(--loyal-blue)' }}>Conversations</h3>
          </div>

          {conversations.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <p>No conversations yet</p>
              <p style={{ fontSize: '0.9rem' }}>
                Connect with users from the Search page to start chatting!
              </p>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                style={{
                  padding: '15px 20px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  backgroundColor: selectedConversation?.id === conversation.id ? '#e3f2fd' : 'transparent'
                }}
              >
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--loyal-blue)' }}>
                  {conversation.otherUserName}
                </h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  {conversation.lastMessage}
                </p>
                <span style={{ fontSize: '0.8rem', color: '#999' }}>
                  {formatTime(conversation.lastMessageAt)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              <div style={{ 
                padding: '20px',
                borderBottom: '1px solid #ddd',
                backgroundColor: '#fff'
              }}>
                <h3 style={{ margin: 0, color: 'var(--loyal-blue)' }}>
                  {selectedConversation.otherUserName}
                </h3>
              </div>

              <div style={{ 
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                backgroundColor: '#fafafa'
              }}>
                {selectedConversation.messages.map(message => (
                  <div
                    key={message.id}
                    style={{
                      marginBottom: '15px',
                      display: 'flex',
                      justifyContent: message.senderId === user?.uid ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      backgroundColor: message.senderId === user?.uid ? 'var(--loyal-blue)' : '#fff',
                      color: message.senderId === user?.uid ? 'white' : 'black',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      <p style={{ margin: '0 0 5px 0' }}>{message.text}</p>
                      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                padding: '20px',
                borderTop: '1px solid #ddd',
                backgroundColor: '#fff'
              }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '25px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: newMessage.trim() ? 'var(--loyal-blue)' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3>Welcome to Skill-Link Chat</h3>
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
