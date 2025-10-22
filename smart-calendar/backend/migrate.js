const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log('🔧 Iniciando migração do banco de dados...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA');

async function migrate() {
  try {
    console.log('🔧 Executando migração do banco...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Tabela users criada');
    console.log('✅ Migração concluída');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

migrate();