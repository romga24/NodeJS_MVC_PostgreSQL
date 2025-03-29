module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('t_clientes', {
    id_cliente: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true },
    nombre: { 
      type: DataTypes.STRING, 
      allowNull: false },
    apellidos: { 
      type: DataTypes.STRING, 
      allowNull: false },
    email: { 
      type: DataTypes.STRING,
      allowNull: false, 
      unique: true },
    telefono: { 
      type: DataTypes.STRING, 
      allowNull: false },
    nif: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true },
    contraseña: { 
      type: DataTypes.STRING, 
      allowNull: false },
    es_admin: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false },
    nombre_usuario: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true }
  }, {
    freezeTableName: true  // Evita que Sequelize pluralice el nombre de la tabla
  });

  // Relaciones
  Cliente.associate = (models) => {
    // Un cliente puede tener muchas reservas
    Cliente.hasMany(models.Reserva, {
      foreignKey: 'id_cliente',
      as: 'reservas',
    });
  };

  return Cliente;
};
