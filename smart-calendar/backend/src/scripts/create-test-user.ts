import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../../.env') });

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

    // --- CREDENCIAIS DO BOTÃO DEMO ---
    const email = 'demo@smartcalendar.app';
    const password = 'demo123';
    const name = 'Usuário Demo';
    // ---------------------------------

    // 1. Verificar se o usuário já existe
    const checkUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (checkUser.rows.length > 0) {
      console.log('⚠️ O usuário demo já existe no banco!');
      // Se quiser resetar a senha, teríamos que fazer um UPDATE aqui,
      // mas vamos assumir que se existe, está ok.
      return;
    }

    // 2. Criar o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Inserir o usuário
    const result = await client.query(
      `INSERT INTO users (name, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    console.log('✅ Usuário Demo criado com sucesso!');
    console.log(`👤 Nome:  ${result.rows[0].name}`);
    console.log(`📧 Email: ${result.rows[0].email}`);
    console.log(`🔑 Senha: ${password}`);

  } catch (err) {
    console.error('❌ Erro ao criar usuário:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

createTestUser();
