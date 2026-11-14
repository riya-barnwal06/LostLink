const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'lostlink.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_type TEXT NOT NULL,
        item_name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        item_date TEXT NOT NULL,
        image_path TEXT,
        contact TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

console.log('LostLink database connected successfully!');

module.exports = db;