const db = require("../config/bd"); 

const VueloModel = {
  // Obtener todos los vuelos
  getAll: (callback) => {
    const sql = `
      SELECT v.id_vuelo, v.numero_vuelo, v.fecha_salida, v.fecha_llegada, 
             v.precio_vuelo AS precio_unitario,
             a_origen.nombre AS aeropuerto_origen, a_destino.nombre AS aeropuerto_destino,
             al.nombre AS aerolinea
      FROM t_vuelos v
      INNER JOIN t_aeropuertos a_origen ON v.id_aeropuerto_origen = a_origen.id_aeropuerto
      INNER JOIN t_aeropuertos a_destino ON v.id_aeropuerto_destino = a_destino.id_aeropuerto
      INNER JOIN t_aerolineas al ON v.id_aerolinea = al.id_aerolinea;
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error ejecutando la consulta:', err);
        return callback(err, null);
      }
      callback(null, result.rows);
    })
  },

  // Obtener un vuelo por ID
  getById: (id, callback) => {
    db.query("SELECT * FROM t_vuelos WHERE id_vuelo = $1", [id], callback);
  },

  // Crear un nuevo vuelo
  create: (vueloData, callback) => {
    const sql = `
      INSERT INTO t_vuelos (numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea, precio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_vuelo;
    `;
    const values = [
      vueloData.numero_vuelo,
      vueloData.id_aeropuerto_origen,
      vueloData.id_aeropuerto_destino,
      vueloData.fecha_salida,
      vueloData.fecha_llegada,
      vueloData.id_avion,
      vueloData.id_aerolinea,
      vueloData.precio,
    ];
    db.query(sql, values, callback);
  },

  // Actualizar un vuelo
  update: (id, vueloData, callback) => {
    const sql = `
      UPDATE t_vuelos 
      SET numero_vuelo = $1, id_aeropuerto_origen = $2, id_aeropuerto_destino = $3, fecha_salida = $4, fecha_llegada = $5, id_avion = $6, id_aerolinea = $7, precio = $8
      WHERE id_vuelo = $9;
    `;
    const values = [
      vueloData.numero_vuelo,
      vueloData.id_aeropuerto_origen,
      vueloData.id_aeropuerto_destino,
      vueloData.fecha_salida,
      vueloData.fecha_llegada,
      vueloData.id_avion,
      vueloData.id_aerolinea,
      vueloData.precio,
      id,
    ];
    db.query(sql, values, callback);
  },

  // Eliminar un vuelo
  delete: (id, callback) => {
    db.query("DELETE FROM t_vuelos WHERE id_vuelo = $1", [id], callback);
  },

  // Obtener vuelos con precios
  getVuelosConFiltro: (codigoOrigen, codigoDestino, fechaIda, fechaVuelta, pasajeros, callback) => {
    const numPasajeros = parseInt(pasajeros, 10);
    
    const sqlIda = `
      SELECT v.id_vuelo, v.numero_vuelo, v.fecha_salida, v.fecha_llegada, 
             v.precio_vuelo AS precio_unitario, (v.precio * $1) AS precio_total,
             a_origen.nombre AS aeropuerto_origen, a_destino.nombre AS aeropuerto_destino,
             a_origen.ciudad AS ciudad_origen, a_destino.ciudad AS ciudad_destino,
             a_origen.pais AS pais_origen, a_destino.pais AS pais_destino,  -- Aquí estaba el error
             al.nombre AS aerolinea
      FROM t_vuelos v
      JOIN t_aeropuertos a_origen ON v.id_aeropuerto_origen = a_origen.id_aeropuerto
      JOIN t_aeropuertos a_destino ON v.id_aeropuerto_destino = a_destino.id_aeropuerto
      JOIN t_aerolineas al ON v.id_aerolinea = al.id_aerolinea
      WHERE a_origen.codigo_iata = $2 AND a_destino.codigo_iata = $3 
            AND v.fecha_salida = $4
      ORDER BY v.fecha_salida;
    `;
  
    const valuesIda = [numPasajeros, codigoOrigen, codigoDestino, fechaIda];
  
    db.query(sqlIda, valuesIda, (err, resultadosIda) => {
      if (err) return callback(err, null);
  
      if (!fechaVuelta) return callback(null, { ida: resultadosIda.rows, vuelta: [] });
  
      const sqlVuelta = `
        SELECT v.id_vuelo, v.numero_vuelo, v.fecha_salida, v.fecha_llegada, 
               v.precio_vuelo AS precio_unitario, (v.precio * $1) AS precio_total,
               a_origen.nombre AS aeropuerto_origen, a_destino.nombre AS aeropuerto_destino,
               a_origen.ciudad AS ciudad_origen, a_destino.ciudad AS ciudad_destino,
               a_origen.pais AS pais_origen, a_destino.pais AS pais_destino,  -- Aquí también
               al.nombre AS aerolinea
        FROM t_vuelos v
        JOIN t_aeropuertos a_origen ON v.id_aeropuerto_origen = a_origen.id_aeropuerto
        JOIN t_aeropuertos a_destino ON v.id_aeropuerto_destino = a_destino.id_aeropuerto
        JOIN t_aerolineas al ON v.id_aerolinea = al.id_aerolinea
        WHERE a_origen.codigo_iata = $2 AND a_destino.codigo_iata = $3 
              AND v.fecha_salida = $4
        ORDER BY v.fecha_salida;
      `;
  
      const valuesVuelta = [numPasajeros, codigoDestino, codigoOrigen, fechaVuelta];
  
      db.query(sqlVuelta, valuesVuelta, (err, resultadosVuelta) => {
        if (err) return callback(err, null);
        callback(null, { ida: resultadosIda.rows, vuelta: resultadosVuelta.rows });
      });
    });
    }
}

module.exports = VueloModel;
