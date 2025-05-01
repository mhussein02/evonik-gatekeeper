import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';

interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
        
        // Check if token exists in database
        const db = await getDb();
        const session = await db.get('SELECT * FROM sessions WHERE token = ? AND expires_at > datetime("now")', [token]);
        
        if (!session) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Add user info to request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'matrix_admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}; 