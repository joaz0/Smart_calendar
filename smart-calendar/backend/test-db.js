require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'smartcalendardb',
  user: 'postgres',
  password: '280799'
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro:', err.message);
  } else {
    console.log('Conectado!', res.rows[0]);
  }
  pool.end();
});
