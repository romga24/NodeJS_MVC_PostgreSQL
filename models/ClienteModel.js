const db = require("../config/bd");
const bcrypt = require("bcryptjs");

const Cliente = {
  
  getAll: (callback) => {
    db.query("SELECT * FROM t_clientes", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM t_clientes WHERE id_cliente = $1", [id], callback);  // Updated for PostgreSQL
  },

  create: (data, callback) => {
    // Encriptar la contraseña antes de insertar en la base de datos
    bcrypt.hash(data.contraseña, 10, (err, hash) => {
      if (err) return callback(err);

      // Reemplazamos la contraseña en los datos con el hash
      data.password = hash;

      // Inserción de los datos del cliente en la base de datos (PostgreSQL)
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

  login: (usuarioOEmail, password, callback) => {
    db.query(
      "SELECT * FROM t_clientes WHERE nombre_usuario = $1 OR email = $1", 
      [usuarioOEmail], 
      (err, results) => {
        if (err) {
          console.error('Error en la consulta SQL:', err);
          return callback(err);  // Si ocurre un error en la consulta, lo devolvemos al callback
        }
  
        if (results.rows.length === 0) {
          console.log('No se encontró el usuario');
          return callback(null, false);  // Si no se encuentra al usuario, devolvemos false
        }
  
        const usuario = results.rows[0];  // Desestructuramos el primer usuario encontrado
  
        bcrypt.compare(password, usuario.contraseña, (err, isMatch) => {
          if (err) {
            console.error('Error al comparar contraseñas:', err);
            return callback(err);  // Si ocurre un error al comparar las contraseñas, lo devolvemos
          }
          if (!isMatch) {
            console.log('Contraseña incorrecta');
            return callback(null, false);  // Si las contraseñas no coinciden, devolvemos false
          }
          
          console.log('Inicio de sesión exitoso');
          callback(null, true);  // Si la contraseña es correcta, devolvemos true
        });
      }
    );
  },


  update: (id, data, callback) => {
    if (data.password) {
      bcrypt.hash(data.password, 10, (err, hash) => {
        if (err) return callback(err);
        data.password = hash;
        db.query("UPDATE t_clientes SET nombre = $1, apellidos = $2, email = $3, telefono = $4, nif = $5, contraseña = $6, es_admin = $7, nombre_usuario = $8 WHERE id_cliente = $9", 
          [data.nombre, data.apellidos, data.email, data.telefono, data.nif, data.password, data.es_admin, data.nombre_usuario, id], 
          callback
        );
      });
    } else {
      db.query("UPDATE t_clientes SET nombre = $1, apellidos = $2, email = $3, telefono = $4, nif = $5, es_admin = $6, nombre_usuario = $7 WHERE id_cliente = $8", 
        [data.nombre, data.apellidos, data.email, data.telefono, data.nif, data.es_admin, data.nombre_usuario, id], 
        callback
      );
    }
  },

  delete: (id, callback) => {
    db.query("DELETE FROM t_clientes WHERE id_cliente = $1", [id], callback);  // Updated for PostgreSQL
  },
};

module.exports = Cliente;
