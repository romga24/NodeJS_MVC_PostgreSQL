module.exports = (sequelize, DataTypes) => {
    
  const Asiento = sequelize.define('t_asientos', {
      id_asiento: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true },
      id_avion: { 
        type: DataTypes.INTEGER, 
        references: { model: 't_aviones', key: 'id_avion' } },
      id_vuelo: { 
        type: DataTypes.INTEGER, 
        references: { model: 't_vuelos', key: 'id_vuelo' } },
      fila: { 
        type: DataTypes.INTEGER, 
        allowNull: false },
      columna: { 
        type: DataTypes.CHAR, 
        allowNull: false },
      codigo_asiento: { 
        type: DataTypes.STRING, 
        allowNull: false },
      clase: { 
        type: DataTypes.STRING, 
        defaultValue: 'economica' },
      estado: { 
        type: DataTypes.STRING, 
        defaultValue: 'disponible' }
    },{
        freezeTableName: true  
      }); 


    Asiento.associate = (models) => {    
      Asiento.belongsTo(models.Avion, {
        foreignKey: 'id_avion',
        as: 'avion',
      });
      Asiento.belongsTo(models.Vuelo, {
        foreignKey: 'id_vuelo',
        as: 'vuelo',
      });
      Asiento.hasOne(models.Billete, {
        foreignKey: 'id_asiento',
        as: 'billete',
      });
    };

    return Asiento;
};
  