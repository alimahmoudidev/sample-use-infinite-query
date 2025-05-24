import { faker } from '@faker-js/faker';
import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

// Database connection instance
let dbConnection;

async function initializeDatabase() {
  try {
    // Open database connection
    dbConnection = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create tables if they don't exist
    await dbConnection.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed initial data if empty
    const { count } = await dbConnection.get('SELECT COUNT(*) as count FROM products');
    if (count === 0) {
      await seedDatabase();
    }

    return dbConnection;
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

async function seedDatabase() {
  const stmt = await dbConnection.prepare(
    'INSERT INTO products (name, price, description) VALUES (?, ?, ?)'
  );

  for (let i = 0; i < 100; i++) {
    await stmt.run(
      faker.commerce.productName(),
      faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
      faker.commerce.productDescription()
    );
  }

  await stmt.finalize();
  console.log('Database seeded with 100 products');
}

async function getProducts(limit = 10, offset = 0) {
  const [products, total] = await Promise.all([
    dbConnection.all('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset]),
    dbConnection.get('SELECT COUNT(*) as count FROM products')
  ]);

  return {
    products,
    total: total.count,
    totalPages: Math.ceil(total.count / limit),
    currentPage: Math.floor(offset / limit) + 1
  };
}

// Initialize immediately and export the promise
const dbReady = initializeDatabase();

export { dbReady, getProducts };
