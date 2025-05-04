

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
