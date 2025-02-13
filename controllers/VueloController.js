const VueloModel = require("../models/VueloModel"); // Importa el modelo de vuelos
const amadeus = require('../config/amadeusConfig');


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

exports.searchVuelos = async (req, res) => {
  const { fecha_inicio, fecha_fin, destino, origen, adultos, niños, bebés, clase } = req.query;

  // Validar parámetros requeridos
  if (!fecha_inicio || !fecha_fin || !destino || !origen) {
    return res.status(400).json({
      message: "Se requieren fecha_inicio, fecha_fin, origen y destino para la búsqueda",
    });
  }

  // Validar formato de fechas
  const fechaInicioDate = new Date(fecha_inicio);
  const fechaFinDate = new Date(fecha_fin);

  if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
    return res.status(400).json({
      message: "Las fechas deben estar en un formato válido",
    });
  }

  if (fechaInicioDate > fechaFinDate) {
    return res.status(400).json({
      message: "La fecha de inicio debe ser anterior a la fecha de fin",
    });
  }

  try {
    // Realizar la búsqueda de vuelos con la API de Amadeus
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origen,
      destinationLocationCode: destino,
      departureDate: fecha_inicio,
      returnDate: fecha_fin,
      adults: adultos || '1',
      children: niños || '0',
      infants: bebés || '0',
      travelClass: clase || 'ECONOMY',
    });

    // Extraer los datos de los vuelos
    const vuelos = response.data.map((vuelo) => {
      const primerSegmento = vuelo.itineraries[0].segments[0];
      const ultimoSegmento = vuelo.itineraries[0].segments.slice(-1)[0];

      return {
        id: vuelo.id,
        precio: vuelo.price.total,
        origen: primerSegmento.departure.iataCode,
        destino: ultimoSegmento.arrival.iataCode,
        fechaSalida: primerSegmento.departure.at,
        fechaLlegada: ultimoSegmento.arrival.at,
        aerolinea: primerSegmento.carrierCode,
      };
    });

    // Devolver los vuelos encontrados
    return res.status(200).json(vuelos);
  } catch (error) {
    console.error('Error al buscar vuelos:', error);
    return res.status(500).json({
      error: "Error al buscar los vuelos",
      details: error.response ? error.response.data : error.message,
    });
  }
};
