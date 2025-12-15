import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false,
});

async function createTestUser() {
  const client = await pool.connect();
  try {
    const passwordHash = await bcrypt.hash('123456', 10);
    
    await client.query(`
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET password_hash = $3
    `, ['teste@teste.com', 'Usuário Teste', passwordHash]);
    
    console.log('✅ Usuário teste criado: teste@teste.com / 123456');
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTestUser();
