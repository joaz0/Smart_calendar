import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();

router.post('/database', async (req, res) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const client = await pool.connect();

  try {
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('123456', 10);
    await client.query(
      `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
      ['teste@teste.com', 'Usuário Teste', hash]
    );
    
    res.json({ success: true, message: 'Setup completo. User: teste@teste.com / 123456' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
    await pool.end();
  }
});

export default router;
