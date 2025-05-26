const transporter = require('../config/nodemailer');
const ReservaService = require('../services/ReservaService');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs').promises;

const EmailService = {

  async enviarCorreoVuelo(id_reserva) {
    try {
      const reserva = await ReservaService.obtenerReservaConDetalles(id_reserva);
      if (!reserva) throw new Error('Reserva no encontrada');
      for (const billete of reserva.billetes) {
          this.generarMailOptions(billete);
      }
      return { success: true, message: 'Correos enviados exitosamente.' };
    } catch (error) {
      console.error('Error al enviar correos:', error);
      throw error;
    }
  },

  async generarMailOptions(billete) {
    const templatePath = path.join(__dirname, '../templates/emails/detalleBillete.ejs');

    try {
      const html = await ejs.renderFile(templatePath, { billete: billete });
       const mailOptions = {
        from: process.env.EMAIL_USER,
        to: billete.pasajero.email,
        subject: "Detalles de tu vuelo - AirLink",
        html
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  },

  async renderCodigoVerificacionHtml(nombre_usuario, codigo) {
    const templatePath = path.join(__dirname, '../templates/emails/codigoVerificacion.ejs');
    try {
      const html = await ejs.renderFile(templatePath, { nombre_usuario, codigo });
      return html;
    } catch (error) {
      throw error;
    }
  },

  async enviarCodigoVerificacion(email, nombre_usuario, codigo) {
    try {
      const html = await this.renderCodigoVerificacionHtml(nombre_usuario, codigo);

      const mailOptions = {
        from: "Soporte de Vuelos",
        to: email,
        subject: "Código de verificación para recuperar tu contraseña",
        html, 
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error("Error al enviar el código de verificación por correo");
    }
  }
};

module.exports = EmailService;
