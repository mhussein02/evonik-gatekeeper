import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import { getDb } from './db';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parser middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'Server is running'
    });
});

// Mount auth routes
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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