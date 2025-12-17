const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  min: 2,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: false
});

async function createTestUser() {
  const client = await pool.connect();
  try {
    const email = 'teste@teste.com';
    const password = '123456';
    const name = 'Usuario Teste';

    // Verificar se já existe
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existing.rows.length > 0) {
      console.log('✅ Usuário já existe!');
      console.log('Email:', email);
      console.log('Senha:', password);
      client.release();
      await pool.end();
      process.exit(0);
    }

    // Criar hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Inserir usuário
    const result = await client.query(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, name, passwordHash]
    );

    console.log('✅ Usuário criado com sucesso!');
    console.log('Email:', email);
    console.log('Senha:', password);
    console.log('ID:', result.rows[0].id);

    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    client.release();
    await pool.end();
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createTestUser();
