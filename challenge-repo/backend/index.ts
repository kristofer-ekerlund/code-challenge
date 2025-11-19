import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306')
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

app.get('/health', async (_, res) => {
  try {
    await pool.execute('SELECT 1+1')
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ status: 'error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const page: number = parseFloat(req.query.page as string) || 1;
    const limit: number = parseFloat(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM products');
    const total = (countResult as any)[0].total;

    // Get paginated products - use LIMIT with offset calculation
    const [rows] = await pool.execute(
      `SELECT * FROM products LIMIT ? OFFSET ?;`,
      [String(limit), String(offset)]
    );

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      products: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch products from database' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
