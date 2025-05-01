import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { getDb } from './db.js';

dotenv.config();

const app = express();

// CORS configuration - more permissive for development
app.use(cors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parser middleware
app.use(express.json());

// Health check endpoint - should be accessible without authentication
app.get('/api/health', (req, res) => {
    console.log('Health check endpoint accessed');
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'Server is running'
    });
});

// Mount auth routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
async function startServer() {
    try {
        await getDb();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log('CORS is enabled and configured to allow all origins');
            console.log('Available endpoints:');
            console.log('- GET  /api/health (public)');
            console.log('- POST /api/auth/login');
            console.log('- POST /api/auth/register');
            console.log('- POST /api/auth/logout');
            console.log('- POST /api/auth/change-password');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 