import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
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
        await db.run(
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
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', {
            body: req.body,
            headers: req.headers,
            method: req.method,
            url: req.url
        });

        const { email, password } = req.body;
        
        if (!email || !password) {
            console.error('Missing email or password');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await getDb();

        // Find user
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            console.error('User not found:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            console.error('Invalid password for user:', email);
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

        console.log('Login successful for user:', email);
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
router.post('/logout', async (req, res) => {
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
router.post('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE id = ?', [decoded.id]);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
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

        // Invalidate all existing sessions for this user
        await db.run('DELETE FROM sessions WHERE user_id = ?', [user.id]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
router.put('/update-profile', async (req, res) => {
    try {
        const { name, email } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const db = await getDb();
        
        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await db.get('SELECT * FROM users WHERE id = ?', [decoded.id]);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Check if new email is already taken by another user
        if (email !== user.email) {
            const existingUser = await db.get('SELECT * FROM users WHERE email = ? AND id != ?', [email, user.id]);
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already taken' });
            }
        }

        // Update user profile
        await db.run(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, user.id]
        );

        res.json({ 
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name,
                email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 