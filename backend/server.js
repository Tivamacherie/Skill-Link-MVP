const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const skillRoutes = require('./routes/skills');
const matchRoutes = require('./routes/matches');
const appointmentRoutes = require('./routes/appointments');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Import database connection
const db = require('./config/database');

// Import Firebase Admin
const admin = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/skills', authenticateToken, skillRoutes);
app.use('/api/matches', authenticateToken, matchRoutes);
app.use('/api/appointments', authenticateToken, appointmentRoutes);
app.use('/api/reviews', authenticateToken, reviewRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);

// Default route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Skill-Link API Server',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            users: '/api/users',
            skills: '/api/skills',
            matches: '/api/matches',
            appointments: '/api/appointments',
            reviews: '/api/reviews',
            notifications: '/api/notifications'
        }
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl 
    });
});

// Database connection test
async function testDatabaseConnection() {
    try {
        await db.execute('SELECT 1');
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

// Start server
async function startServer() {
    try {
        await testDatabaseConnection();
        
        const server = app.listen(PORT, () => {
            console.log(`
🚀 Skill-Link Backend Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running on port ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API Base URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(() => {
                console.log('Server closed');
                db.end();
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received, shutting down gracefully');
            server.close(() => {
                console.log('Server closed');
                db.end();
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;