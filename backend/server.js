const express = require('express');
const { getProducts } = require('./database');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Pagination API for products
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { products, total } = await getProducts(limit, offset);
    const totalPages = Math.ceil(total / limit);
    await new Promise(resolve => setTimeout(resolve, 2000));
    res.json({
      // page,
      limit,
      total,
      totalPages,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
