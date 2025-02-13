const VueloModel = require("../models/VueloModel"); 

// Obtener todos los vuelos
exports.getAllVuelos = (req, res) => {
  VueloModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener los vuelos", details: err.message });
    res.status(200).json(results);
  });
};

// Obtener un vuelo por ID
exports.getVueloById = (req, res) => {
  const { id } = req.params;
  VueloModel.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener el vuelo", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vuelo no encontrado" });
    res.status(200).json(result);
  });
};

// Crear un nuevo vuelo
exports.createVuelo = (req, res) => {
  const { numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea } = req.body;

  if (!numero_vuelo || !id_aeropuerto_origen || !id_aeropuerto_destino || !fecha_salida || !fecha_llegada || !id_avion || !id_aerolinea) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const vueloData = { numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea };

  VueloModel.create(vueloData, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear el vuelo", details: err.message });
    res.status(200).json({ message: "Vuelo creado con éxito", id: result.insertId });
  });
};

// Actualizar un vuelo
exports.updateVuelo = (req, res) => {
  const { id } = req.params;
  const { numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea } = req.body;
  const vueloData = { numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea };

  VueloModel.update(id, vueloData, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar el vuelo", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vuelo no encontrado" });

    res.status(200).json({ message: "Vuelo actualizado con éxito" });
  });
};

// Eliminar un vuelo
exports.deleteVuelo = (req, res) => {
  const { id } = req.params;

  VueloModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar el vuelo", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vuelo no encontrado" });

    res.status(200).json({ message: "Vuelo eliminado con éxito" });
  });
};

exports.getVuelosConFiltro = (req, res) => {
  const { idOrigen, idDestino, fechaIda, fechaVuelta, pasajeros } = req.body;

  // Verificar que los parámetros requeridos estén presentes
  if (!idOrigen || !idDestino || !fechaIda || !pasajeros) {
    return res.status(400).json({ error: "Faltan parámetros obligatorios" });
  }

  VueloModel.getVuelosConFiltro(idOrigen, idDestino, fechaIda, fechaVuelta, pasajeros, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener los vuelos", details: err.message });

    res.status(200).json(result);
  });
};




