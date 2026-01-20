import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createPrivacySettingsTable(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS privacy_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON privacy_settings(user_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Tabela privacy_settings criada com sucesso');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar tabela:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createPrivacySettingsTable().catch((error) => {
  console.error(error);
  process.exit(1);
});
