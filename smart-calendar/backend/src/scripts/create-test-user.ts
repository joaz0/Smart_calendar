import { query } from '../config/database';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    const passwordHash = await bcrypt.hash('123456', 12);
    
    const result = await query(`
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET password_hash = $3
      RETURNING id, email, name
    `, ['teste@teste.com', 'Usuario Teste', passwordHash]);
    
    console.log('✅ Usuário criado: teste@teste.com / 123456');
    console.log('ID:', result.rows[0].id);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createTestUser();
