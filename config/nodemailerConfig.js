/*********************************************************
 * Servicio de envío de correos electrónicos con Nodemailer
 *
 * Este módulo utiliza la librería 'nodemailer' para enviar correos 
 * electrónicos a través de una cuenta de Gmail. Las credenciales 
 * de autenticación se configuran mediante variables de entorno 
 * (EMAIL_USER y EMAIL_PASS).
 *
 * Funcionalidad principal:
 * - Configura un transporte SMTP con Gmail.
 * - Permite enviar correos especificando destinatario, asunto y mensaje.
 *
 *********************************************************/
const { Reserva, Pasajero, Vuelo, Asiento, Billete } = require('../models');

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS   
  }
});

const enviarCorreoVuelo = async (id_reserva) => {
  try {
    // Obtener la reserva con los billetes y detalles de vuelo
    const reserva = await Reserva.findOne({
      where: { id_reserva },
      include: [
        {
          model: Billete,
          as: 'billetes',
          include: [
            { model: Vuelo, as: 'vuelo' },
            { model: Asiento, as: 'asiento' },
            { model: Pasajero, as: 'pasajero' }
          ]
        }
      ]
    });

    if (!reserva) throw new Error('Reserva no encontrada');

    // Enviar un correo a cada pasajero
    for (const billete of reserva.billetes) {
      const { pasajero, vuelo, asiento, localizador, precio } = billete;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: pasajero.email,
        subject: "Detalles de tu vuelo - AirLink",
        html: `
          <p>Hola ${pasajero.nombre} ${pasajero.apellidos},</p>
          <p>Aquí están los detalles de tu vuelo:</p>
          <ul>
            <li><strong>Vuelo:</strong> ${vuelo.numero_vuelo}</li>
            <li><strong>Fecha de salida:</strong> ${vuelo.fecha_salida}</li>
            <li><strong>Fecha de llegada:</strong> ${vuelo.fecha_llegada}</li>
            <li><strong>Asiento:</strong> ${asiento.codigo_asiento} (Fila: ${asiento.fila}, Columna: ${asiento.columna})</li>
            <li><strong>Precio:</strong> ${precio} EUR</li>
            <li><strong>Localizador:</strong> ${localizador}</li>
          </ul>
          <p>¡Gracias por volar con AirLink!</p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    return { success: true, message: 'Correos enviados exitosamente.' };
  } catch (error) {
    console.error('Error al enviar correos:', error);
    throw error;
  }
};

module.exports = {
  enviarCorreoVuelo
};
