module.exports = (sequelize, DataTypes) => {
  const Aerolinea = sequelize.define('t_aerolineas', {
    id_aerolinea: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true },
    nombre: { 
      type: DataTypes.STRING, 
      allowNull: false },
    codigo_iata: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true }
  },{
    freezeTableName: true  
  });

  Aerolinea.associate = (models) => {
    // Una aerolínea tiene muchos aviones
    Aerolinea.hasMany(models.Avion, {
      foreignKey: 'id_aerolinea',  // La clave foránea en la tabla Avion
      as: 'aviones',                // Alias para la relación
    });
    // Una aerolínea tiene muchos vuelos
    Aerolinea.hasMany(models.Vuelo, {
      foreignKey: 'id_aerolinea',  // La clave foránea en la tabla Vuelo (no id_vuelo)
      as: 'vuelos',                 // Alias para la relación
    });
  };

  return Aerolinea;
};

