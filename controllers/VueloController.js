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

// Buscar vuelos en un intervalo de fechas y por destino
exports.searchVuelos = async (req, res) => {
  const { fecha_inicio, fecha_fin, destino, origen } = req.query;

  // Validar parámetros requeridos
  if (!fecha_inicio || !fecha_fin || !destino || !origen) {
    return res.status(400).json({
      message: "Se requieren fecha_inicio, fecha_fin, origen y destino para la búsqueda",
    });
  }

  try {
    // Realizar la búsqueda de vuelos con la API de Amadeus
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origen,
      destinationLocationCode: destino,
      departureDate: fecha_inicio,
      returnDate: fecha_fin,
      adults: '1', // Puedes agregar más parámetros según tus necesidades
    });

    // Extraer los datos de los vuelos
    const vuelos = response.data.map((vuelo) => ({
      id: vuelo.id,
      precio: vuelo.price.total,
      origen: vuelo.itineraries[0].segments[0].departure.iataCode,
      destino: vuelo.itineraries[0].segments.slice(-1)[0].arrival.iataCode,
      fechaSalida: vuelo.itineraries[0].segments[0].departure.at,
      fechaLlegada: vuelo.itineraries[0].segments.slice(-1)[0].arrival.at,
      aerolinea: vuelo.itineraries[0].segments[0].carrierCode,
    }));

    // Devolver los vuelos encontrados
    res.status(200).json(vuelos);
  } catch (error) {
    console.error('Error al buscar vuelos:', error);
    res.status(500).json({
      error: "Error al buscar los vuelos",
      details: error.response ? error.response.data : error.message,
    });
  }
};
