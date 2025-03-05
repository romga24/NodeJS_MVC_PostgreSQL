module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('t_reservas', {
    id_reserva: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_cliente: { type: DataTypes.INTEGER, references: { model: 't_clientes', key: 'id_cliente' } },
    fecha_reserva: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false }
  },{
    freezeTableName: true  // Evita que Sequelize pluralice el nombre de la tabla
  });

  // Relaciones
  Reserva.associate = (models) => {
    // Una reserva pertenece a un cliente
    Reserva.belongsTo(models.Cliente, {
      foreignKey: 'id_cliente',
      as: 'cliente',
    });

    // Una reserva tiene muchos billetes
    Reserva.hasMany(models.Billete, {
      foreignKey: 'id_reserva',
      as: 'billetes',
    });
  };

  return Reserva;
};
