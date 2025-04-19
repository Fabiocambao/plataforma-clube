const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('📦 Ligado à base de dados PostgreSQL'))
  .catch((err) => console.error('❌ Erro na ligação à base de dados:', err));

module.exports = pool;
