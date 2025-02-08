const db = require("../config/bd");
const bcrypt = require("bcryptjs");

const Cliente = {
  
  getAll: (callback) => {
    db.query("SELECT * FROM t_clientes", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM t_clientes WHERE id_cliente = ?", [id], callback);
  },

  create: (data, callback) => {
    bcrypt.hash(data.password, 10, (err, hash) => {
      if (err) return callback(err);
      data.password = hash;
      db.query("INSERT INTO t_clientes SET ?", data, callback);
    });
  },

  login: (usuarioOEmail, password, callback) => {
    db.query(
      "SELECT * FROM t_clientes WHERE nombre_usuario = ? OR email = ?", 
      [usuarioOEmail, usuarioOEmail], 
      (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null);
        
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
          if (err) return callback(err);
          if (!isMatch) return callback(null, null);
          callback(null, results[0]);
        });
      }
    );
  },

  update: (id, data, callback) => {
    if (data.password) {
      bcrypt.hash(data.password, 10, (err, hash) => {
        if (err) return callback(err);
        data.password = hash;
        db.query("UPDATE t_clientes SET ? WHERE id_cliente = ?", [data, id], callback);
      });
    } else {
      db.query("UPDATE t_clientes SET ? WHERE id_cliente = ?", [data, id], callback);
    }
  },

  delete: (id, callback) => {
    db.query("DELETE FROM t_clientes WHERE id_cliente = ?", [id], callback);
  },
};

module.exports = Cliente;