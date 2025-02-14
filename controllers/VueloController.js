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
  
  const { codigoOrigen, codigoDestino, fechaIda, fechaVuelta, pasajeros } = req.body;

  // Verificar que los parámetros requeridos estén presentes
  if (!codigoOrigen || !codigoDestino || !fechaIda || !pasajeros) {
    return res.status(400).json({ error: "Faltan parámetros obligatorios" });
  }

  // Convertir 'pasajeros' a entero
  const numPasajeros = parseInt(pasajeros, 10);

  // Verificar si 'pasajeros' es un número válido
  if (isNaN(numPasajeros) || numPasajeros <= 0) {
    return res.status(400).json({ error: "El número de pasajeros no es válido" });
  }

  // Validar y convertir las fechas al formato YYYY-MM-DD
  const isValidDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;  // Regex para validar fecha en formato YYYY-MM-DD
    return regex.test(dateStr);
  };

  if (!isValidDate(fechaIda)) {
    return res.status(400).json({ error: "La fecha de ida no es válida. El formato debe ser YYYY-MM-DD" });
  }

  if (fechaVuelta && !isValidDate(fechaVuelta)) {
    return res.status(400).json({ error: "La fecha de vuelta no es válida. El formato debe ser YYYY-MM-DD" });
  }

  // Llamada al modelo para obtener los vuelos
  VueloModel.getVuelosConFiltro(codigoOrigen, codigoDestino, fechaIda, fechaVuelta, numPasajeros, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener los vuelos", details: err.message });

    res.status(200).json(result);
  });
};
;




