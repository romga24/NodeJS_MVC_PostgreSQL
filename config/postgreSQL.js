/*********************************************************
 * Configuración y sincronización de la base de datos con Sequelize
 *
 * Este módulo establece la conexión a una base de datos PostgreSQL 
 * utilizando la librería 'sequelize'. Las credenciales y parámetros 
 * de conexión se definen mediante variables de entorno.
 *
 * Funcionalidad principal:
 * - Crea una instancia de Sequelize con soporte para SSL.
 * - Verifica la conexión con la base de datos.
 * - Ofrece opciones para sincronizar los modelos definidos 
 *   con las tablas de la base de datos (sync).
 *
 * Variables de entorno necesarias: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD y DB_NAME
 *
 * Opciones de sincronización disponibles (comentadas por defecto):
 * - force: true → Elimina y recrea todas las tablas.
 * - alter: true → Ajusta las tablas existentes sin eliminar datos.
 *
 * Este archivo exporta la instancia de Sequelize para ser reutilizada 
 * en otros módulos del proyecto.
 *
 *********************************************************/
const { Sequelize } = require('sequelize');
require("dotenv").config();

// Instancia de Sequelize
const sequelize = new Sequelize({
  host: process.env.DB_HOST,              
  port: process.env.DB_PORT || 5432,     
  username: process.env.DB_USER,          
  password: process.env.DB_PASSWORD,      
  database: process.env.DB_NAME,         
  dialect: 'postgres',                          
  dialectOptions: {
    ssl: {
        require: true,
        rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: false, 
  }                          
});

// Sincronizar los modelos con la base de datos
(async () => {
  try {

   /*************Comandos para realizar modificaciones en las tablas de la base de datos*********/
   
   /*await sequelize.sync({ force: true });*/
   /*await sequelize.sync({ alter: true });*/

  console.log('Todas las tablas sincronizadas correctamente');
  } catch (error) {
    console.error('Error al sincronizar las tablas:', error);
  }
})();


// Verifica la conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("> Conexión establecida correctamente.");
  })
  .catch((error) => {
    console.error("> Error de conexión:", error);
  });

module.exports = sequelize;
