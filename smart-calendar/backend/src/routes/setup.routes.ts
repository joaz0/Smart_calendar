import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();

router.post('/database', async (req, res) => {
  const client = await new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }).connect();

  try {
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    res.json({ success: true, message: 'Database setup completed' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

export default router;
