const ReservaService = require('../services/ReservaService');
const AsientoService = require('../services/AsientoService');
const VueloService = require('../services/VueloService');
const emailService = require("../services/EmailService");

const puppeteer = require('puppeteer');
const fs = require('fs').promises; 
const path = require('path');

exports.realizarReserva = async (req, res) => { 
  try {
    const id_cliente = req.user.sub;
    const { codigo_vuelo_ida, codigo_vuelo_vuelta, pasajeros } = req.body;

    if (!id_cliente || !codigo_vuelo_ida || !Array.isArray(pasajeros) || pasajeros.length === 0) {
      return res.status(400).json({ error: 'Datos inválidos: Faltan datos necesarios o pasajeros vacíos.' });
    }

    // Realizar la reserva
  const reserva = await ReservaService.realizarReserva(id_cliente, codigo_vuelo_ida, codigo_vuelo_vuelta, pasajeros);
  await emailService.enviarCorreoVuelo(reserva.id_reserva);
    // Devolver el id de la reserva con un mensaje de éxito
    return res.status(201).json({
      message: 'Reserva realizada con éxito y correos enviados',
      id_reserva: reserva.id_reserva 
    });

  } catch (error) {
    console.error('Error al realizar la reserva:', error);
    return res.status(500).json({ error: 'Error interno del servidor. No se pudo realizar la reserva.' });
  }
};

exports.generarPdfVuelo = async (req, res) => {
  const { id_reserva } = req.params;

  try {
    const reserva = await ReservaService.obtenerReservaConDetalles(id_reserva);
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    // Renderizar el HTML completo para PDF
    const fullHtml = await ReservaService.renderPdfReserva(reserva);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="reserva_${id_reserva}.pdf"`);
    res.end(pdfBuffer);

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando PDF' });
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


