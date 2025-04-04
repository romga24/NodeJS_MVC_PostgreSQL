// Importar el servicio de vuelos
const VueloService = require('../services/VueloService');

exports.createVuelo = async (req, res) => {
  try {
    const { numero_vuelo, fecha_salida, fecha_llegada, id_aeropuerto_origen, id_aeropuerto_destino, id_avion, id_aerolinea, precio_vuelo } = req.body;
    if (!numero_vuelo || !fecha_salida || !fecha_llegada || !id_aeropuerto_origen || !id_aeropuerto_destino || !id_avion || !id_aerolinea || !precio_vuelo) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    const nuevoVuelo = await VueloService.createVuelo({
      numero_vuelo,
      fecha_salida,
      fecha_llegada,
      id_aeropuerto_origen,
      id_aeropuerto_destino,
      id_avion,
      id_aerolinea,
      precio_vuelo
    });
    res.status(201).json(nuevoVuelo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear el vuelo" });
  }
};

exports.getVuelosConFiltro = async (req, res) => {
  try {
    const { codigo_origen, codigo_destino, fecha_ida, fecha_vuelta, numero_pasajeros } = req.body;
    if (!codigo_origen || !codigo_destino || !fecha_ida) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos: codigoOrigen, codigoDestino, fechaIda.' });
    }
    const vuelos = await VueloService.getVuelosConFiltro(codigo_origen, codigo_destino, fecha_ida, fecha_vuelta, numero_pasajeros);
    return res.status(200).json(vuelos);
  } catch (error) {
    console.error('Error en el controlador al obtener vuelos con filtros:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

exports.modificarEstadoVuelo = async (req, res) => {
  try {
    const { codigo_vuelo, estado_vuelo } = req.body;
    if (!codigo_vuelo || !estado_vuelo || codigo_vuelo != 'C') {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }
    const vuelos = await VueloService.modificarEstadoVuelo(codigo_vuelo, estado_vuelo);
    return res.status(200).json({messaje: "Vuelo modificado con exito"});
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

exports.getAllVuelos = async (req, res) => {
  try {
    const vuelos = await VueloService.getAllVuelos();
    res.status(200).json(vuelos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los vuelos"});
  }
};





