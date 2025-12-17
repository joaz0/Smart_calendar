require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'smartcalendardb',
  user: 'postgres',
  password: '280799'
});

async function run() {
  try {
    const hash = await bcrypt.hash('123456', 12);
    const result = await pool.query(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET password_hash = $3 RETURNING id',
      ['teste@teste.com', 'Usuario Teste', hash]
    );
    console.log('✅ Usuário criado: teste@teste.com / 123456');
    console.log('ID:', result.rows[0].id);
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await pool.end();
  }
}

run();
