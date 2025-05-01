import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getDb } from '../db';

const router = express.Router();

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// Register new user
router.post('/register', async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const db = await getDb();

        // Check if user already exists
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert new user
        const result = await db.run(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, passwordHash, role]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    try {
        const { email, password } = req.body;
        const db = await getDb();

        // Find user
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Store session
        await db.run(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+24 hours"))',
            [user.id, token]
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout user
router.post('/logout', async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const db = await getDb();
        await db.run('DELETE FROM sessions WHERE token = ?', [token]);

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password
router.post('/change-password', async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
        const db = await getDb();
        
        // Get user from database
        const user = await db.get('SELECT * FROM users WHERE id = ?', [decoded.id]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password in database
        await db.run(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [newPasswordHash, user.id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 