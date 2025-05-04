module.exports = (sequelize, DataTypes) => {
  const Avion = sequelize.define('t_aviones', {
    id_avion: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    modelo: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    capacidad: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    distribucion_asientos: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    total_asientos: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    }
  }, {
    freezeTableName: true // Evita que Sequelize pluralice el nombre de la tabla
  });

  // Relaciones
  Avion.associate = (models) => {
    // Un avión tiene muchos vuelos
    Avion.hasMany(models.Vuelo, {
      foreignKey: 'id_avion',
      as: 'vuelos',
    });

    // Un avión tiene muchos asientos
    Avion.hasMany(models.Asiento, {
      foreignKey: 'id_avion',
      as: 'asientos',
    });
  };

  return Avion;
};
