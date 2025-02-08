// controllers/aeropuertoController.js
const aeropuertoModel = require("../models/AeropuertoModel");


class AeropuertoController {
  
  getAllAeropuertos = (req, res) => {
    aeropuertoModel.getAll((err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json(results);
    });
  };
  
  getClienteById(req, res) {
    const id = parseInt(req.params.id);  // Convertir el id a número entero
    if (isNaN(id)) {
      return res.status(400).json({ message: "El ID debe ser un número válido" });
    }
  
    Cliente.getById(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al obtener el cliente", details: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.status(200).json(results[0]);  // Devolver el primer cliente encontrado
    });
  }
  
  
  createAeropuerto = (req, res) => {
    const data = req.body;
    aeropuertoModel.create(data, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: results.insertId, ...data });
    });
  };
  
  updateAeropuerto = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    aeropuertoModel.update(id, data, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json({ message: "Aeropuerto actualizado correctamente" });
    });
  };
  
  deleteAeropuerto = (req, res) => {
    const id = req.params.id;
     aeropuertoModel.delete(id, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(204).json({ message: "Aeropuerto eliminado correctamente" });
    });
  };
}

module.exports = new AeropuertoController();
