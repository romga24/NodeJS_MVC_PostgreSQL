const db = require("../config/bd");
const bcrypt = require("bcryptjs");

const Cliente = {
  
  getAll: (callback) => {
    db.query("SELECT * FROM t_clientes", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM t_clientes WHERE id_cliente = $1", [id], callback); 
  },


  create: (data, callback) => {
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
    if (data.password) {
      // Encriptar la contraseña nueva
      bcrypt.hash(data.password, 10, (err, hash) => {
        if (err) return callback(err); 

        data.contraseña = hash;

        const query = "UPDATE t_clientes SET nombre = $1, apellidos = $2, email = $3, telefono = $4, nif = $5, contraseña = $6, es_admin = $7, nombre_usuario = $8 WHERE id_cliente = $9";
        const values = [data.nombre, data.apellidos, data.email, data.telefono, data.nif, data.contraseña, data.es_admin, data.nombre_usuario];

        db.query(query, values, callback);
      });
    } else {
      const query = "UPDATE t_clientes SET nombre = $1, apellidos = $2, email = $3, telefono = $4, nif = $5, es_admin = $6, nombre_usuario = $7 WHERE id_cliente = $8";
      const values = [data.nombre, data.apellidos, data.email, data.telefono, data.nif, data.es_admin, data.nombre_usuario];

      db.query(query, values, callback);
    }
},

  delete: (id, callback) => {
    db.query("DELETE FROM t_clientes WHERE id_cliente = $1", [id], callback);  // Updated for PostgreSQL
  },
};

module.exports = Cliente;
