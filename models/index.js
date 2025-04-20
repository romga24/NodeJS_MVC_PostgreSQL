const Sequelize = require('sequelize');
const sequelize = require('./../config/postgreSQL');

const models = {
    Vuelo: require('./Vuelo')(sequelize, Sequelize.DataTypes),
    Aerolinea: require('./Aerolinea')(sequelize, Sequelize.DataTypes),
    Aeropuerto: require('./Aeropuerto')(sequelize, Sequelize.DataTypes),
    Avion: require('./Avion')(sequelize, Sequelize.DataTypes),
    Reserva: require('./Reserva')(sequelize, Sequelize.DataTypes),
    Asiento: require('./Asiento')(sequelize, Sequelize.DataTypes),
    Cliente: require('./Cliente')(sequelize, Sequelize.DataTypes),
    Billete: require('./Billete')(sequelize, Sequelize.DataTypes),
    Pasajero: require('./Pasajero')(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
