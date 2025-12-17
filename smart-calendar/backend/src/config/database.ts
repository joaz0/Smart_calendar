import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const useRemoteDB = process.env.DATABASE_URL?.includes('render.com');

export const pool = new Pool(
  useRemoteDB ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    min: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: false,
  } : {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'smartcalendardb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: false,
    max: 10,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 10000,
  }
);

pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro no PostgreSQL:', err.message);
});

export const query = async (text: string, params?: any[]) => {
  let client;
  try {
    client = await pool.connect();
    return await client.query(text, params);
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
};
