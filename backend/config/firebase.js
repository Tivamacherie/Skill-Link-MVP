const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
};

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
    });
    
    console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
    throw error;
}

// Helper functions for Firebase operations
const firebaseHelpers = {
    // Verify Firebase ID token
    async verifyIdToken(idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            throw new Error('Invalid Firebase token: ' + error.message);
        }
    },

    // Get user by UID
    async getUserByUid(uid) {
        try {
            const userRecord = await admin.auth().getUser(uid);
            return userRecord;
        } catch (error) {
            throw new Error('User not found: ' + error.message);
        }
    },

    // Update user in Firebase
    async updateUser(uid, properties) {
        try {
            const userRecord = await admin.auth().updateUser(uid, properties);
            return userRecord;
        } catch (error) {
            throw new Error('Failed to update user: ' + error.message);
        }
    },

    // Delete user from Firebase
    async deleteUser(uid) {
        try {
            await admin.auth().deleteUser(uid);
            return true;
        } catch (error) {
            throw new Error('Failed to delete user: ' + error.message);
        }
    },

    // Send custom claims
    async setCustomUserClaims(uid, claims) {
        try {
            await admin.auth().setCustomUserClaims(uid, claims);
            return true;
        } catch (error) {
            throw new Error('Failed to set custom claims: ' + error.message);
        }
    },

    // Firestore helpers
    firestore: {
        // Get Firestore instance
        db: admin.firestore(),

        // Create a new conversation in Firestore
        async createConversation(participant1Id, participant2Id, matchId = null) {
            try {
                const conversationRef = this.db.collection('conversations').doc();
                const conversationData = {
                    participants: [participant1Id, participant2Id],
                    matchId: matchId,
                    lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isActive: true,
                    unreadCount: {
                        [participant1Id]: 0,
                        [participant2Id]: 0
                    }
                };

                await conversationRef.set(conversationData);
                return conversationRef.id;
            } catch (error) {
                throw new Error('Failed to create conversation: ' + error.message);
            }
        },

        // Send a message
        async sendMessage(conversationId, senderId, receiverId, message) {
            try {
                const messageRef = this.db
                    .collection('conversations')
                    .doc(conversationId)
                    .collection('messages')
                    .doc();

                const messageData = {
                    senderId: senderId,
                    receiverId: receiverId,
                    text: message.text,
                    type: message.type || 'text',
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    isRead: false
                };

                // Use batch to update both message and conversation
                const batch = this.db.batch();
                
                batch.set(messageRef, messageData);
                
                // Update conversation last message
                const conversationRef = this.db.collection('conversations').doc(conversationId);
                batch.update(conversationRef, {
                    lastMessage: message.text,
                    lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
                    [`unreadCount.${receiverId}`]: admin.firestore.FieldValue.increment(1)
                });

                await batch.commit();
                return messageRef.id;
            } catch (error) {
                throw new Error('Failed to send message: ' + error.message);
            }
        },

        // Mark messages as read
        async markMessagesAsRead(conversationId, userId) {
            try {
                const conversationRef = this.db.collection('conversations').doc(conversationId);
                
                await conversationRef.update({
                    [`unreadCount.${userId}`]: 0
                });

                return true;
            } catch (error) {
                throw new Error('Failed to mark messages as read: ' + error.message);
            }
        },

        // Get user's conversations
        async getUserConversations(userId) {
            try {
                const snapshot = await this.db
                    .collection('conversations')
                    .where('participants', 'array-contains', userId)
                    .where('isActive', '==', true)
                    .orderBy('lastMessageAt', 'desc')
                    .get();

                const conversations = [];
                snapshot.forEach(doc => {
                    conversations.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                return conversations;
            } catch (error) {
                throw new Error('Failed to get conversations: ' + error.message);
            }
        },

        // Get conversation messages
        async getConversationMessages(conversationId, limit = 50) {
            try {
                const snapshot = await this.db
                    .collection('conversations')
                    .doc(conversationId)
                    .collection('messages')
                    .orderBy('timestamp', 'desc')
                    .limit(limit)
                    .get();

                const messages = [];
                snapshot.forEach(doc => {
                    messages.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                return messages.reverse(); // Return in chronological order
            } catch (error) {
                throw new Error('Failed to get messages: ' + error.message);
            }
        }
    }
};

module.exports = {
    admin,
    ...firebaseHelpers
};