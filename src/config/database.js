import pkg from 'sqlite3';
const { Database } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/database.sqlite');
const db = new Database(dbPath);

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        displayName TEXT,
        discriminator TEXT,
        avatar TEXT,
        banner TEXT,
        access_token TEXT,
        refresh_token TEXT,
        about_me TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Projects table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        project_url TEXT,
        github_url TEXT,
        technologies TEXT,
        featured BOOLEAN DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Skills table
    db.run(`CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        level TEXT,
        category TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Add displayName column if it doesn't exist (migration)
    db.run(`ALTER TABLE users ADD COLUMN displayName TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding displayName column:', err);
        }
    });

    // Add image_url column to skills if it doesn't exist (migration)
    db.run(`ALTER TABLE skills ADD COLUMN image_url TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding image_url column to skills:', err);
        }
    });

    // Add order_index column to projects if it doesn't exist (migration)
    db.run(`ALTER TABLE projects ADD COLUMN order_index INTEGER DEFAULT 0`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding order_index column to projects:', err);
        }
    });
});

// Database helper functions
const database = {
    // User functions
    async getUserByDiscordId(discordId) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE discord_id = ?', [discordId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    async createUser(userData) {
        return new Promise((resolve, reject) => {
            const { discordId, username, displayName, discriminator, avatar, banner, accessToken, refreshToken } = userData;
            db.run(
                'INSERT INTO users (discord_id, username, displayName, discriminator, avatar, banner, access_token, refresh_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [discordId, username, displayName, discriminator, avatar, banner, accessToken, refreshToken],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...userData });
                }
            );
        });
    },

    async updateUser(id, userData) {
        return new Promise((resolve, reject) => {
            // Map camelCase keys to snake_case database columns
            const fieldMap = {
                'accessToken': 'access_token',
                'refreshToken': 'refresh_token',
                'discordId': 'discord_id',
                'displayName': 'displayName' // This one stays the same
            };
            
            const fields = Object.keys(userData).map(key => {
                const dbColumn = fieldMap[key] || key;
                return `${dbColumn} = ?`;
            }).join(', ');
            
            const values = Object.values(userData);
            values.push(id);
            
            db.run(
                `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                values,
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, ...userData });
                }
            );
        });
    },

    // Project functions
    async getProjects(userId, featured = false) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM projects WHERE user_id = ?';
            let params = [userId];
            
            if (featured) {
                query += ' AND featured = 1';
            }
            
            query += ' ORDER BY featured DESC, order_index ASC, created_at DESC';
            
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    async createProject(projectData) {
        return new Promise((resolve, reject) => {
            const { userId, title, description, imageUrl, projectUrl, githubUrl, technologies, featured, orderIndex } = projectData;
            db.run(
                'INSERT INTO projects (user_id, title, description, image_url, project_url, github_url, technologies, featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, title, description, imageUrl, projectUrl, githubUrl, technologies, featured ? 1 : 0, orderIndex || 0],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...projectData });
                }
            );
        });
    },

    async updateProject(id, projectData) {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(projectData).map(key => `${key} = ?`).join(', ');
            const values = Object.values(projectData);
            values.push(id);
            
            db.run(
                `UPDATE projects SET ${fields} WHERE id = ?`,
                values,
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, ...projectData });
                }
            );
        });
    },

    async deleteProject(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },

    // Skills functions
    async getSkills(userId) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM skills WHERE user_id = ? ORDER BY name', [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    async createSkill(skillData) {
        return new Promise((resolve, reject) => {
            const { userId, name, level, category, imageUrl, url } = skillData;
            db.run(
                'INSERT INTO skills (user_id, name, level, category, image_url, url) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, name, level, category, imageUrl, url],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...skillData });
                }
            );
        });
    },

    async updateSkill(id, skillData) {
        return new Promise((resolve, reject) => {
            // Map camelCase keys to snake_case database columns
            const fieldMap = {
                'imageUrl': 'image_url'
            };
            
            const fields = Object.keys(skillData).map(key => {
                const dbColumn = fieldMap[key] || key;
                return `${dbColumn} = ?`;
            }).join(', ');
            
            const values = Object.values(skillData);
            values.push(id);
            
            db.run(
                `UPDATE skills SET ${fields} WHERE id = ?`,
                values,
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, ...skillData });
                }
            );
        });
    },

    async deleteSkill(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM skills WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },

    async getProjectById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    async getSkillById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM skills WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

export default database;
