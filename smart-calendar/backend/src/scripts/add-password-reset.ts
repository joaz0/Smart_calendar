import { pool } from '../config/database';

async function addPasswordResetColumns() {
  try {
    console.log('🔧 Adicionando colunas para reset de senha...');
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMP;
    `);
    
    console.log('✅ Colunas reset_token e reset_expires adicionadas');
    
    // Criar índice para performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token) 
      WHERE reset_token IS NOT NULL;
    `);
    
    console.log('✅ Índice para reset_token criado');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar colunas:', error);
    throw error;
  }
}

addPasswordResetColumns()
  .then(() => {
    console.log('✅ Migração concluída');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migração falhou:', error);
    process.exit(1);
  });