const db = require('../config/db'); // Importa la conexión a la base de datos

const VueloModel = {
  // Obtener todos los vuelos
  getAll: (callback) => {
    db.query('SELECT * FROM t_vuelos', callback);
  },

  // Obtener un vuelo por ID
  getById: (id, callback) => {
    db.query('SELECT * FROM t_vuelos WHERE id_vuelo = ?', [id], callback);
  },

  // Crear un nuevo vuelo
  create: (vueloData, callback) => {
    const sql = 'INSERT INTO t_vuelos (numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [
      vueloData.numero_vuelo,
      vueloData.id_aeropuerto_origen,
      vueloData.id_aeropuerto_destino,
      vueloData.fecha_salida,
      vueloData.fecha_llegada,
      vueloData.id_avion,
      vueloData.id_aerolinea
    ];
    db.query(sql, values, callback);
  },

  // Actualizar un vuelo
  update: (id, vueloData, callback) => {
    const sql = 'UPDATE t_vuelos SET numero_vuelo = ?, id_aeropuerto_origen = ?, id_aeropuerto_destino = ?, fecha_salida = ?, fecha_llegada = ?, id_avion = ?, id_aerolinea = ? WHERE id_vuelo = ?';
    const values = [
      vueloData.numero_vuelo,
      vueloData.id_aeropuerto_origen,
      vueloData.id_aeropuerto_destino,
      vueloData.fecha_salida,
      vueloData.fecha_llegada,
      vueloData.id_avion,
      vueloData.id_aerolinea,
      id
    ];
    db.query(sql, values, callback);
  },

  // Eliminar un vuelo
  delete: (id, callback) => {
    db.query('DELETE FROM t_vuelos WHERE id_vuelo = ?', [id], callback);
  }
};

module.exports = VueloModel;
