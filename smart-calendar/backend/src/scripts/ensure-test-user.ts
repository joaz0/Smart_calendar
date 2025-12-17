import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function ensureTestUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('render.com') 
      ? { rejectUnauthorized: false } 
      : false
  });

  try {
    const passwordHash = await bcrypt.hash('123456', 12);
    
    const result = await pool.query(`
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash
      RETURNING id, email, name
    `, ['teste@teste.com', 'Usuario Teste', passwordHash]);
    
    console.log('✅ Usuário teste garantido no banco');
    console.log('📧 Email: teste@teste.com');
    console.log('🔑 Senha: 123456');
    console.log('🆔 ID:', result.rows[0].id);
    
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
    await pool.end();
    process.exit(1);
  }
}

ensureTestUser();
