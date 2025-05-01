import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

export async function getDb() {
    if (db) return db;

    // Ensure database directory exists
    const dbDir = join(__dirname, '../database');
    if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
    }

    // Open database connection
    db = await open({
        filename: join(dbDir, 'evonik.db'),
        driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Initialize schema if needed
    const schemaPath = join(__dirname, '../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    await db.exec(schema);

    return db;
}

export async function closeDb() {
    if (db) {
        await db.close();
        db = null;
    }
} 