const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTestUser() {
  const client = await pool.connect();

  try {
    console.log('🔌 Conectado ao banco de dados...');

    // --- AQUI ESTÃO AS CREDENCIAIS DO BOTÃO DEMO ---
    const email = 'demo@smartcalendar.app';
    const password = 'demo123';
    const name = 'Usuário Demo';
    // -----------------------------------------------

    // 1. Verificar se o usuário já existe
    const checkUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (checkUser.rows.length > 0) {
      console.log('⚠️ O usuário demo já existe!');
      console.log(`📧 Email: ${email}`);
      console.log('🔑 Senha: (A mesma que você definiu antes)');
      return;
    }

    // 2. Criar o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Inserir o usuário
    const result = await client.query(
      `INSERT INTO users (name, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    console.log('✅ Usuário Demo criado com sucesso!');
    console.log('-----------------------------------');
    console.log(`👤 Nome:  ${result.rows[0].name}`);
    console.log(`📧 Email: ${result.rows[0].email}`);
    console.log(`🔑 Senha: ${password}`);
    console.log('-----------------------------------');

  } catch (err) {
    console.error('❌ Erro ao criar usuário:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

createTestUser();
