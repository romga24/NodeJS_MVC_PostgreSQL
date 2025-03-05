// Importar el servicio de vuelos
const VueloService = require('../services/VueloService');

exports.getAllVuelos = async (req, res) => {
  try {
    const vuelos = await VueloService.getAll();
    if (vuelos.mensaje) {
      return res.status(404).json({ mensaje: vuelos.mensaje });
    }
    return res.status(200).json(vuelos);
  } catch (error) {
    console.error('Error al obtener los vuelos:', error);
    return res.status(500).json({ error: 'Error al obtener los vuelos.' });
  }
};

exports.getVueloById = async (req, res) => {
  try {
    const { id } = req.params;
    const vuelo = await VueloService.getById(id);
    if (vuelo.mensaje) {
      return res.status(404).json({ mensaje: vuelo.mensaje });
    }
    return res.status(200).json(vuelo);
  } catch (error) {
    console.error('Error al obtener el vuelo:', error);
    return res.status(500).json({ error: 'Error al obtener el vuelo.' });
  }
};

exports.createVuelo = async (req, res) => {
  try {
    const vuelo = req.body;
    const nuevoVuelo = await VueloService.create(vuelo);
    return res.status(201).json(nuevoVuelo);
  } catch (error) {
    console.error('Error al crear el vuelo:', error);
    return res.status(500).json({ error: 'Error al crear el vuelo.' });
  }
}

exports.updateVuelo = async (req, res) => {
  try {
    const { id } = req.params;
    const vuelo = req.body;
    const result = await VueloService.update(id, vuelo);
    if (result.mensaje) {
      return res.status(404).json({ mensaje: result.mensaje });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error al actualizar el vuelo:', error);
    return res.status(500).json({ error: 'Error al actualizar el vuelo.' });
  }
};

exports.deleteVuelo = async (req, res) => {
  try {
    const { numero_vuelo } = req.params;
    const result = await VueloService.deleteByNumeroVuelo(numero_vuelo);
    if (result.mensaje) {
      return res.status(404).json({ mensaje: result.mensaje });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error al eliminar el vuelo:', error);
    return res.status(500).json({ error: 'Error al eliminar el vuelo.' });
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





