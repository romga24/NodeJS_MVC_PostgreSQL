module.exports = (sequelize, DataTypes) => {
  const Aeropuerto = sequelize.define('t_aeropuertos', {
    id_aeropuerto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    ciudad: { type: DataTypes.STRING, allowNull: false },
    pais: { type: DataTypes.STRING, allowNull: false },
    codigo_iata: { type: DataTypes.STRING, allowNull: false, unique: true }
  },{
    freezeTableName: true  // Evita que Sequelize pluralice el nombre de la tabla
  });

  // Relaciones
  Aeropuerto.associate = (models) => {
    // Un aeropuerto puede tener muchos vuelos de origen
    Aeropuerto.hasMany(models.Vuelo, {
      foreignKey: 'id_aeropuerto_origen',
      as: 'vuelos_origen',
    });

    // Un aeropuerto puede tener muchos vuelos de destino
    Aeropuerto.hasMany(models.Vuelo, {
      foreignKey: 'id_aeropuerto_destino',
      as: 'vuelos_destino',
    });
  };

  return Aeropuerto;
};

  