/*********************************************************
 * Fichero de configuracion de la base de datos PostgreSQL 
 * ******************************************************/

const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,  // Puerto por defecto de PostgreSQL
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },  // SSL para Render
});

client.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos PostgreSQL");
});

module.exports = client;

