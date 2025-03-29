module.exports = (sequelize, DataTypes) => {
    const Billete = sequelize.define('t_billetes', {
        id_billete: { 
          type: DataTypes.INTEGER, 
          primaryKey: true, 
          autoIncrement: true },
        id_reserva: { 
          type: DataTypes.INTEGER, 
          references: { model: 't_reservas', key: 'id_reserva' } },
        id_vuelo: { 
          type: DataTypes.INTEGER, 
          references: { model: 't_vuelos', key: 'id_vuelo' } },
        id_pasajero: { 
          type: DataTypes.INTEGER, 
          references: { model: 't_pasajeros', key: 'id_pasajero' } },
        id_asiento: { 
          type: DataTypes.INTEGER, 
          references: { model: 't_asientos', key: 'id_asiento' } },
        localizador: { 
          type: DataTypes.STRING, 
          allowNull: false, 
          unique: true 
        },
        precio: { type: DataTypes.DECIMAL, allowNull: false }
    },{
        freezeTableName: true  // Evita que Sequelize pluralice el nombre de la tabla
      });
  
    // Relaciones
    Billete.associate = (models) => {
      // Un billete pertenece a una reserva
      Billete.belongsTo(models.Reserva, {
        foreignKey: 'id_reserva',
        as: 'reserva',
      });
  
      // Un billete pertenece a un vuelo
      Billete.belongsTo(models.Vuelo, {
        foreignKey: 'id_vuelo',
        as: 'vuelo',
      });
  
      // Un billete pertenece a un pasajero
      Billete.belongsTo(models.Pasajero, {
        foreignKey: 'id_pasajero',
        as: 'pasajero',
      });
  
      // Un billete tiene un asiento asignado
      Billete.belongsTo(models.Asiento, {
        foreignKey: 'id_asiento',
        as: 'asiento',
      });
    };
  
    return Billete;
  };
  