// Utility function to start a conversation between users
export const startConversation = (
  otherUserId: string,
  otherUserName: string,
  currentUserId: string,
  currentUserName: string
): string => {
  const conversations = JSON.parse(localStorage.getItem('skill-link-conversations') || '[]');
  
  // Check if conversation already exists
  const existingConv = conversations.find((conv: any) => 
    conv.participants.includes(currentUserId) && conv.participants.includes(otherUserId)
  );
  
  if (existingConv) {
    return existingConv.id;
  }

  // Create new conversation
  const newConversation = {
    id: `conv_${Date.now()}`,
    participants: [currentUserId, otherUserId],
    otherUserName: otherUserName,
    messages: [{
      id: `msg_${Date.now()}`,
      text: `Hi ${otherUserName}! I'd like to connect and exchange skills.`,
      senderId: currentUserId,
      timestamp: new Date().toISOString()
    }],
    lastMessage: `Hi ${otherUserName}! I'd like to connect and exchange skills.`,
    lastMessageAt: new Date().toISOString()
  };

  conversations.push(newConversation);
  localStorage.setItem('skill-link-conversations', JSON.stringify(conversations));
  
  return newConversation.id;
};