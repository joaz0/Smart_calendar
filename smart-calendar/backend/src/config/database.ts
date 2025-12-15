import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const useRemoteDB = process.env.DATABASE_URL?.includes('render.com');

export const pool = new Pool(
  useRemoteDB ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    query_timeout: 60000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
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
