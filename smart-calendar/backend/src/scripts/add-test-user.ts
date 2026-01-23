import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  const client = await pool.connect();
  try {
    // AS CREDENCIAIS MÁGICAS DO BOTÃO DEMO 👇
    const email = 'demo@smartcalendar.app';
    const password = 'demo123';
    const name = 'Usuário Demo';

    // Hash da senha usando bcrypt (igual ao sistema de login)
    const passwordHash = await bcrypt.hash(password, 12);

    // Verificar se usuário já existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️ Usuário já existe, atualizando senha...');
      await pool.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
        [passwordHash, email]
      );
      console.log('✅ Senha do usuário atualizada');
    } else {
      // Inserir novo usuário
      const result = await pool.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, name`,
        [email, name, passwordHash]
      );

      console.log('✅ Usuário criado:', result.rows[0]);

      // Criar categorias padrão para o usuário
      const userId = result.rows[0].id;
      await pool.query(
        `INSERT INTO categories (name, color, user_id) VALUES
         ('Trabalho', '#2196F3', $1),
         ('Pessoal', '#4CAF50', $1),
         ('Estudos', '#FF9800', $1),
         ('Saúde', '#E91E63', $1)`,
        [userId]
      );
      console.log('✅ Categorias padrão criadas');
    }

    console.log('\n🎉 Usuário de teste configurado:');
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', password);
    console.log('👤 Nome:', name);

  } catch (error) {
    console.error('❌ Erro ao adicionar usuário de teste:', error);
    throw error;
  }
}

// Executar
addTestUser()
  .then(() => {
    console.log('✅ Usuário de teste adicionado com sucesso');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha ao adicionar usuário:', error);
    process.exit(1);
  });
