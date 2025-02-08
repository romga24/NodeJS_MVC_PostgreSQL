// models/aeropuertoModel.js
const db = require("../config/bd");

const Aeropuerto = {
  
  getAll: (callback) => {
    db.query("SELECT * FROM t_aeropuertos", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM t_aeropuertos WHERE id_aeropuerto = $1", [id], callback);
  },

  create: (data, callback) => {
    db.query("INSERT INTO t_aeropuertos SET ?", data, callback);
  },

  update: (id, data, callback) => {
    db.query("UPDATE t_aeropuertos SET ? WHERE id_aeropuerto = ?", [data, id], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM t_aeropuertos WHERE id_aeropuerto = ?", [id], callback);
  },
};

module.exports = Aeropuerto;
