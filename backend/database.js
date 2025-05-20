const sqlite3 = require('sqlite3').verbose();
const { faker } = require('@faker-js/faker');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database and seed data
const initDatabase = () => {
  db.serialize(() => {
    // Create products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT
      )
    `);

    // Check if table is empty
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('Error checking table:', err);
        return;
      }

      if (row.count === 0) {
        console.log('Seeding database with 100 random products...');
        const stmt = db.prepare(`
          INSERT INTO products (name, price, description)
          VALUES (?, ?, ?)
        `);

        for (let i = 0; i < 100; i++) {
          stmt.run(
            faker.commerce.productName(),
            faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
            faker.commerce.productDescription()
          );
        }
        stmt.finalize();
        console.log('Database seeded successfully');
      }
    });
  });
};

// Get products with pagination
const getProducts = (limit, offset) => {
  return new Promise((resolve, reject) => {
    const result = { products: [], total: 0 };

    // Get total count
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) return reject(err);
      result.total = row.count;

      // Get paginated products
      db.all(`
        SELECT * FROM products
        LIMIT ? OFFSET ?
      `, [limit, offset], (err, rows) => {
        if (err) return reject(err);
        result.products = rows;
        resolve(result);
      });
    });
  });
};

// Initialize database on startup
initDatabase();

module.exports = { getProducts };
