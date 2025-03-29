module.exports = (sequelize, DataTypes) => {
  const Vuelo = sequelize.define('t_vuelos', {
    id_vuelo: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true },
    numero_vuelo: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true },
    id_aeropuerto_origen: { 
      type: DataTypes.INTEGER, 
      references: { model: 't_aeropuertos', key: 'id_aeropuerto' }
    },
    id_aeropuerto_destino: { 
      type: DataTypes.INTEGER, 
      references: { model: 't_aeropuertos', key: 'id_aeropuerto' }
    },
    fecha_salida: { type: DataTypes.DATE, allowNull: false },
    fecha_llegada: { type: DataTypes.DATE, allowNull: false },
    id_avion: { 
      type: DataTypes.INTEGER, 
      references: { model: 't_aviones', key: 'id_avion' }
    },
    id_aerolinea: { 
      type: DataTypes.INTEGER, 
      references: { model: 't_aerolineas', key: 'id_aerolinea' }
    },
    precio_vuelo: { 
      type: DataTypes.FLOAT,  
      allowNull: false, 
      validate: { min: 0 } 
    },
    estado_vuelo: { 
      type: DataTypes.ENUM('Programado', 'Cancelado'),
      allowNull: false,
      defaultValue: 'Programado'
    }
  },{
    freezeTableName: true  
  });

  // Relaciones
  Vuelo.associate = (models) => {
    // Un vuelo pertenece a un aeropuerto de origen
    Vuelo.belongsTo(models.Aeropuerto, {
      foreignKey: 'id_aeropuerto_origen',
      as: 'aeropuerto_origen',
    });

    // Un vuelo pertenece a un aeropuerto de destino
    Vuelo.belongsTo(models.Aeropuerto, {
      foreignKey: 'id_aeropuerto_destino',
      as: 'aeropuerto_destino',
    });

    // Un vuelo pertenece a una aerolínea
    Vuelo.belongsTo(models.Aerolinea, {
      foreignKey: 'id_aerolinea',
      as: 'aerolinea',
    });

    // Un vuelo tiene un avión asignado
    Vuelo.belongsTo(models.Avion, {
      foreignKey: 'id_avion',
      as: 'avion',
    });

    // Un vuelo tiene muchos billetes
    Vuelo.hasMany(models.Billete, {
      foreignKey: 'id_vuelo',
      as: 'billetes',
    });

    Vuelo.hasMany(models.Asiento, {
      foreignKey: 'id_vuelo',
      as: 'asientos',
    });
  };

  return Vuelo;
};
