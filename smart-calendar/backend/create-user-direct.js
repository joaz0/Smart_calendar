require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
    query_timeout: 30000,
    statement_timeout: 30000
  });

  try {
    console.log('🔄 Conectando ao banco...');
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    const passwordHash = await bcrypt.hash('123456', 10);
    
    const result = await client.query(`
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET password_hash = $3
      RETURNING id, email, name
    `, ['teste@teste.com', 'Usuario Teste', passwordHash]);
    
    console.log('✅ Usuário criado/atualizado:');
    console.log('   Email: teste@teste.com');
    console.log('   Senha: 123456');
    console.log('   ID:', result.rows[0].id);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

createTestUser();
