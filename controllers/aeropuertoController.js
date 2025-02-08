// controllers/aeropuertoController.js
const Aeropuerto = require("../models/AeropuertoModel");

exports.getAllAeropuertos = (req, res) => {
  Aeropuerto.getAll((err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
};

exports.getAeropuertoById = (req, res) => {
  const id = req.params.id;
  Aeropuerto.getById(id, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Aeropuerto no encontrado" });
      return;
    }
    res.status(200).json(results[0]);
  });
};

exports.createAeropuerto = (req, res) => {
  const data = req.body;
  Aeropuerto.create(data, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: results.insertId, ...data });
  });
};

exports.updateAeropuerto = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  Aeropuerto.update(id, data, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ message: "Aeropuerto actualizado correctamente" });
  });
};

exports.deleteAeropuerto = (req, res) => {
  const id = req.params.id;
  Aeropuerto.delete(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(204).json({ message: "Aeropuerto eliminado correctamente" });
  });
};