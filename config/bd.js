

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

/*// Importar modelos con la instancia de sequelize
const Vuelo = require('./../models/Vuelo')(sequelize, DataTypes);
const Aeropuerto = require('./../models/Aeropuerto')(sequelize, DataTypes);
const Avion = require('./../models/Avion')(sequelize, DataTypes);
const Aerolinea = require('./../models/Aerolinea')(sequelize, DataTypes);
const Asiento = require('./../models/Asiento')(sequelize, DataTypes);
const Reserva = require('./../models/Reserva')(sequelize, DataTypes);
const Billete = require('./../models/Billete')(sequelize, DataTypes);
const Pasajero = require('./../models/Pasajero')(sequelize, DataTypes);
const Cliente = require('./../models/Pasajero')(sequelize, DataTypes)*/


// Sincronizar los modelos con la base de datos
(async () => {
  try {
   // Primero, sincronizamos las tablas que no dependen de otras
   /*await Aerolinea.sync({ force: true });
   await Aeropuerto.sync({ force: true });
   await Avion.sync({ force: true });
   await Cliente.sync({ force: true });
   
   // Ahora sincronizamos las tablas que tienen dependencias
   await Vuelo.sync({ force: true });
   await Reserva.sync({ force: true });
   await Asiento.sync({ force: true });
   await Billete.sync({ force: true });
   await Pasajero.sync({ force: true });*/
   //await sequelize.sync({ force: true });


  console.log('Todas las tablas sincronizadas correctamente');
  } catch (error) {
    console.error('Error al sincronizar las tablas:', error);
  }
})();


// Verifica la conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");
  })
  .catch((error) => {
    console.error("Error de conexión:", error);
  });

module.exports = sequelize;
