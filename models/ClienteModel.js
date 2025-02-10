const db = require("../config/bd");
const bcrypt = require("bcryptjs");

const Cliente = {
  
  //OK
  getAll: (callback) => {
    db.query("SELECT * FROM t_clientes", callback);
  },

  //OK
  getById: (id, callback) => {
    db.query("SELECT * FROM t_clientes WHERE id_cliente = $1", [id], callback); 
  },

  //OK
  create: (data, callback) => {
    bcrypt.hash(data.contraseña, 10, (err, hash) => {
      if (err) return callback(err);
      data.password = hash;
      db.query(
        "INSERT INTO t_clientes (nombre, apellidos, email, telefono, nif, contraseña, es_admin, nombre_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", 
        [data.nombre, data.apellidos, data.email, data.telefono, data.nif, data.password, data.es_admin, data.nombre_usuario],
        (err, result) => {
          if (err) {
            return callback(null, false);
          }
          callback(null, true);
        }
      );
    });
  },

  //OK
  login: (usuarioOEmail, password, callback) => {
    const query = "SELECT * FROM t_clientes WHERE nombre_usuario = $1 OR email = $1";
    db.query(query, [usuarioOEmail], async (err, results) => {
        if (err) return callback(err); 
        if (results.rows.length === 0) return callback(null, false);
        const usuario = results.rows[0];
        const isMatch = await bcrypt.compare(password, usuario.contraseña);  
        if (isMatch) return callback(null, usuario);  
        else return callback(null, false); 
    });
},


  update: (id, data, callback) => {
    let values;

  if (data.password) {
    bcrypt.hash(data.password, 10, (err, hash) => {
      if (err) return callback(err);
      data.contraseña = hash;  // Usamos el hash de la contraseña cifrada

      // Definimos los valores de la consulta SQL
      values = [ data.nombre,data.apellidos, data.email, data.telefono, data.nif,   data.contraseña,  data.es_admin, data.nombre_usuario, id];

      const query = "UPDATE t_clientes SET nombre = $1, apellidos = $2, email = $3, telefono = $4, nif = $5, contraseña = $6, es_admin = $7, nombre_usuario = $8 WHERE id_cliente = $9";
      
      db.query(query, values, (err, result) => {
        if (err) return callback(err);
        if (result.rowCount === 0) {
          return callback(null, false);  // No se encontró el cliente
        }
        callback(null, true);  // Actualización exitosa
      });
    });
  } else {
    // Si no hay contraseña para actualizar, usamos esta consulta
    values = [ data.nombre,data.apellidos, data.email, data.telefono, data.nif,  data.es_admin, data.nombre_usuario, id];;

    const query = "UPDATE t_clientes SET nombre = $1, apellidos = $2, email = $3, telefono = $4, nif = $5, es_admin = $6, nombre_usuario = $7 WHERE id_cliente = $8";
    
    db.query(query, values, (err, result) => {
      if (err) return callback(err);
      if (result.rowCount === 0) {
        return callback(null, false);  // No se encontró el cliente
      }
      callback(null, true);  // Actualización exitosa
    });
  }
},

  delete: (id, callback) => {
    db.query("DELETE FROM t_clientes WHERE id_cliente = $1", [id], callback);  // Updated for PostgreSQL
  },
};

module.exports = Cliente;
