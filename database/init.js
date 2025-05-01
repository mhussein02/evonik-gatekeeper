import { getDb } from '../server/db.js';
import bcrypt from 'bcrypt';

async function initializeDatabase() {
    try {
        const db = await getDb();

        // Create test users
        const testUsers = [
            {
                name: 'John Doe',
                email: 'john.doe@evonik.com',
                password: 'password',
                role: 'matrix_admin'
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@evonik.com',
                password: 'password123',
                role: 'data_admin'
            }
        ];

        for (const user of testUsers) {
            // Check if user already exists
            const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [user.email]);
            if (!existingUser) {
                // Hash password
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(user.password, salt);

                // Insert user
                await db.run(
                    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                    [user.name, user.email, passwordHash, user.role]
                );
                console.log(`Created user: ${user.email}`);
            }
        }

        console.log('Database initialization completed');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initializeDatabase(); 