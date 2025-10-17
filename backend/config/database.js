const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'skill_link',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    timezone: 'Z'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

// Helper function to execute queries
async function executeQuery(query, params = []) {
    try {
        const [rows, fields] = await pool.execute(query, params);
        return { rows, fields };
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
}

// Helper function for transactions
async function executeTransaction(queries) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const results = [];
        for (const { query, params } of queries) {
            const [rows] = await connection.execute(query, params || []);
            results.push(rows);
        }
        
        await connection.commit();
        connection.release();
        
        return results;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
}

// User-specific database functions
const userQueries = {
    // Create or update user profile
    async upsertUser(firebaseUid, userData) {
        const query = `
            INSERT INTO users (firebase_uid, email, display_name, bio, profile_picture_url, is_online, last_seen)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
                display_name = VALUES(display_name),
                bio = VALUES(bio),
                profile_picture_url = VALUES(profile_picture_url),
                is_online = VALUES(is_online),
                last_seen = NOW(),
                updated_at = NOW()
        `;
        
        const params = [
            firebaseUid,
            userData.email,
            userData.display_name,
            userData.bio || null,
            userData.profile_picture_url || null,
            userData.is_online || true
        ];
        
        return executeQuery(query, params);
    },

    // Get user by Firebase UID
    async getUserByFirebaseUid(firebaseUid) {
        const query = `
            SELECT u.*, 
                   GROUP_CONCAT(DISTINCT s1.name) as can_teach,
                   GROUP_CONCAT(DISTINCT s2.name) as wants_to_learn
            FROM users u
            LEFT JOIN user_skills us ON u.id = us.user_id
            LEFT JOIN skills s1 ON us.skill_id = s1.id
            LEFT JOIN user_learning_interests uli ON u.id = uli.user_id
            LEFT JOIN skills s2 ON uli.skill_id = s2.id
            WHERE u.firebase_uid = ? AND u.is_active = TRUE
            GROUP BY u.id
        `;
        
        const { rows } = await executeQuery(query, [firebaseUid]);
        return rows[0] || null;
    },

    // Update user skills
    async updateUserSkills(userId, skills) {
        const queries = [
            { query: 'DELETE FROM user_skills WHERE user_id = ?', params: [userId] }
        ];

        for (const skill of skills) {
            queries.push({
                query: `
                    INSERT INTO user_skills (user_id, skill_id, proficiency_level)
                    SELECT ?, s.id, ?
                    FROM skills s
                    WHERE s.name = ?
                `,
                params: [userId, skill.proficiency || 'Intermediate', skill.name]
            });
        }

        return executeTransaction(queries);
    },

    // Update user learning interests
    async updateUserInterests(userId, interests) {
        const queries = [
            { query: 'DELETE FROM user_learning_interests WHERE user_id = ?', params: [userId] }
        ];

        for (const interest of interests) {
            queries.push({
                query: `
                    INSERT INTO user_learning_interests (user_id, skill_id, urgency_level)
                    SELECT ?, s.id, ?
                    FROM skills s
                    WHERE s.name = ?
                `,
                params: [userId, interest.urgency || 'Medium', interest.name]
            });
        }

        return executeTransaction(queries);
    },

    // Search users for matching
    async searchUsers(searchTerm, currentUserId, limit = 20) {
        const query = `
            SELECT DISTINCT u.id, u.firebase_uid, u.display_name, u.bio, 
                   u.profile_picture_url, u.rating, u.is_online, u.last_seen,
                   GROUP_CONCAT(DISTINCT s1.name) as can_teach,
                   GROUP_CONCAT(DISTINCT s2.name) as wants_to_learn
            FROM users u
            LEFT JOIN user_skills us ON u.id = us.user_id
            LEFT JOIN skills s1 ON us.skill_id = s1.id
            LEFT JOIN user_learning_interests uli ON u.id = uli.user_id
            LEFT JOIN skills s2 ON uli.skill_id = s2.id
            WHERE u.id != ? AND u.is_active = TRUE
            AND (
                u.display_name LIKE ? OR
                u.bio LIKE ? OR
                s1.name LIKE ? OR
                s2.name LIKE ?
            )
            GROUP BY u.id
            ORDER BY u.is_online DESC, u.rating DESC, u.last_seen DESC
            LIMIT ?
        `;
        
        const searchPattern = `%${searchTerm}%`;
        const params = [
            currentUserId,
            searchPattern,
            searchPattern,
            searchPattern,
            searchPattern,
            limit
        ];
        
        const { rows } = await executeQuery(query, params);
        return rows;
    },

    // Get potential matches for a user
    async getPotentialMatches(userId, limit = 10) {
        const query = `
            SELECT DISTINCT 
                u.id, u.firebase_uid, u.display_name, u.bio, 
                u.profile_picture_url, u.rating, u.is_online,
                s1.name as can_teach_skill,
                s2.name as wants_to_learn_skill,
                (
                    SELECT COUNT(*) 
                    FROM user_skills us1 
                    JOIN user_learning_interests uli2 ON us1.skill_id = uli2.skill_id
                    WHERE us1.user_id = ? AND uli2.user_id = u.id
                ) +
                (
                    SELECT COUNT(*) 
                    FROM user_learning_interests uli1 
                    JOIN user_skills us2 ON uli1.skill_id = us2.skill_id
                    WHERE uli1.user_id = ? AND us2.user_id = u.id
                ) as match_score
            FROM users u
            JOIN user_skills us ON u.id = us.user_id
            JOIN skills s1 ON us.skill_id = s1.id
            JOIN user_learning_interests uli ON u.id = uli.user_id
            JOIN skills s2 ON uli.skill_id = s2.id
            WHERE u.id != ? AND u.is_active = TRUE
            AND (
                -- They can teach what I want to learn
                us.skill_id IN (
                    SELECT skill_id FROM user_learning_interests WHERE user_id = ?
                )
                OR
                -- I can teach what they want to learn
                uli.skill_id IN (
                    SELECT skill_id FROM user_skills WHERE user_id = ?
                )
            )
            HAVING match_score > 0
            ORDER BY match_score DESC, u.rating DESC, u.is_online DESC
            LIMIT ?
        `;
        
        const params = [userId, userId, userId, userId, userId, limit];
        const { rows } = await executeQuery(query, params);
        return rows;
    }
};

module.exports = {
    pool,
    executeQuery,
    executeTransaction,
    testConnection,
    userQueries
};