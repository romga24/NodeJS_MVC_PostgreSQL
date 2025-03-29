module.exports = (sequelize, DataTypes) => {
    const Pasajero = sequelize.define('t_pasajeros', {
      id_pasajero: { 
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
        type: DataTypes.STRING 
      },
      telefono: { 
        type: DataTypes.STRING 
      },
      nif: { 
        type: DataTypes.STRING, 
        allowNull: false }
    },{
        freezeTableName: true  // Evita que Sequelize pluralice el nombre de la tabla
      });
  
    // Relaciones
    Pasajero.associate = (models) => {
      // Un pasajero puede tener muchos billetes
      Pasajero.hasMany(models.Billete, {
        foreignKey: 'id_pasajero',
        as: 'billetes',
      });
    };
  
    return Pasajero;
  };
  