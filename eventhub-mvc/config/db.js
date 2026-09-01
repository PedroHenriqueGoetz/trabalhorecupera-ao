const mysql = require('mysql2/promise');

/**
 * Pool de conexoes MySQL, configurado via variaveis de ambiente.
 * Usa SSL quando DB_SSL=true (necessario para provedores como Aiven).
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined
});

module.exports = pool;
