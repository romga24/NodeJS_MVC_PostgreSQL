const ReservaService = require('../services/ReservaService');
const AsientoService = require('../services/AsientoService');
const emailService = require("../config/nodemailerConfig");

exports.realizarReserva = async (req, res) => { 
  try {
    const id_cliente = req.user.sub;
    const { codigo_vuelo_ida, codigo_vuelo_vuelta, pasajeros } = req.body;

    if (!id_cliente || !codigo_vuelo_ida || !codigo_vuelo_vuelta || !Array.isArray(pasajeros) || pasajeros.length === 0) {
      return res.status(400).json({ error: 'Datos inválidos: Faltan datos necesarios o pasajeros vacíos.' });
    }

    // Realizar la reserva
    const reserva = await ReservaService.realizarReserva(id_cliente, codigo_vuelo_ida, codigo_vuelo_vuelta, pasajeros);
    
    // Enviar correos con los detalles de la reserva
    await emailService.enviarCorreoVuelo(reserva.reservaId);

    // Devolver el id de la reserva con un mensaje de éxito
    return res.status(201).json({
      message: 'Reserva realizada con éxito y correos enviados',
      reservaId: reserva.reservaId  // Ahora devolvemos solo el ID de la reserva
    });

  } catch (error) {
    console.error('Error al realizar la reserva:', error);
    return res.status(500).json({ error: 'Error interno del servidor. No se pudo realizar la reserva.' });
  }
};


exports.realizarReservaConAsignacionAleatoria = async (req, res) => {
  try {
    const id_cliente = req.user.sub;
    const { codigo_vuelo_ida, codigo_vuelo_vuelta, pasajeros } = req.body;

    // Validar que los datos sean correctos
    if (!id_cliente || !codigo_vuelo_ida || !codigo_vuelo_vuelta || !Array.isArray(pasajeros) || pasajeros.length === 0) {
      return res.status(400).json({ error: 'Datos inválidos: Faltan datos necesarios o pasajeros vacíos.' });
    }

    // Obtener la distribución de asientos de los vuelos
    const distribucionIda = await AsientoService.getAllAsientos(codigo_vuelo_ida);
    const distribucionVuelta = await AsientoService.getAllAsientos(codigo_vuelo_vuelta);

    // Asignar asientos aleatorios a cada pasajero
    for (const pasajero of pasajeros) {
      // Asiento de ida
      const asientoIda = ReservaService.obtenerAsientoAleatorio(distribucionIda.distribucion_asientos);
      pasajero.ida.fila = asientoIda.fila;
      pasajero.ida.columna = asientoIda.columna;
      pasajero.ida.codigo_asiento = asientoIda.codigo_asiento;

      const asientoVuelta = ReservaService.obtenerAsientoAleatorio(distribucionVuelta.distribucion_asientos);
      pasajero.vuelta.fila = asientoVuelta.fila;
      pasajero.vuelta.columna = asientoVuelta.columna;
      pasajero.vuelta.codigo_asiento = asientoVuelta.codigo_asiento;
    }

    const reserva = await ReservaService.realizarReserva(
      id_cliente,
      codigo_vuelo_ida,
      codigo_vuelo_vuelta,
      pasajeros
    );

    return res.status(201).json({
      message: 'Reserva realizada con éxito',
      reserva
    });

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor. No se pudo realizar la reserva.' });
  }
};

// Obtener la reserva de un cliente
exports.obtenerReservaCliente = async (req, res) => {
  try {
    const id_cliente = req.user.sub;

    if (!id_cliente) {
      return res.status(400).json({ error: 'ID del cliente no proporcionado.' });
    }

    const reservas = await ReservaService.obtenerReservasPorCliente(id_cliente);

    if (!reservas || reservas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reservas para este cliente.' });
    }

    return res.status(200).json({ reservas });

  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Eliminar la reserva de un cliente
exports.eliminarReservaCliente = async (req, res) => {
  try {
    const id_cliente = req.user.sub;
    const { id_reserva } = req.params;

    if (!id_cliente || !id_reserva) {
      return res.status(400).json({ error: 'Datos insuficientes.' });
    }

    const resultado = await ReservaService.eliminarReserva(id_cliente, id_reserva);

    if (!resultado.success) {
      return res.status(404).json({ error: resultado.message });
    }

    return res.status(200).json({ message: 'Reserva eliminada exitosamente.' });

  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Eliminar un billete asociado a una reserva del cliente
exports.eliminarBilleteDeReserva = async (req, res) => {
  try {
    const id_cliente = req.user.sub;
    const { id_reserva, id_billete } = req.params;

    if (!id_cliente || !id_reserva || !id_billete) {
      return res.status(400).json({ error: 'Datos insuficientes.' });
    }

    const resultado = await ReservaService.eliminarBillete(id_cliente, id_reserva, id_billete);

    if (!resultado.success) {
      return res.status(404).json({ error: resultado.message });
    }

    return res.status(200).json({ message: 'Billete eliminado exitosamente.' });

  } catch (error) {
    console.error('Error al eliminar el billete:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


