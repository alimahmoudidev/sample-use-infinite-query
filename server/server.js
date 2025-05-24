import cors from 'cors';
import express from 'express';
import { getProducts } from './database.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(express.json());
app.use(cors());

/**
 * Products API with pagination
 * @route GET /api/products
 * @param {number} [page=1] - Page number
 * @param {number} [limit=10] - Items per page
 * @returns {Object} Paginated products response
 */
app.get('/api/products', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
    const { products, total } = await getProducts(limit, offset);
    const totalPages = Math.ceil(total / limit);

    res.json({
      page,
      limit,
      total,
      totalPages,
      data: products,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Health check endpoint
app.get('/health', (_, res) => res.sendStatus(200));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});