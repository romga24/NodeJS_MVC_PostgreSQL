const { Reserva, Pasajero, Vuelo, Asiento, Billete, Aeropuerto } = require('../models');
const transporter = require('../config/nodemailer');

const EmailService = {
  
  async enviarCorreoVuelo(id_reserva) {
    try {
      const reserva = await this.obtenerReservaConDetalles(id_reserva);
      if (!reserva) throw new Error('Reserva no encontrada');

      for (const billete of reserva.billetes) {
        const mailOptions = this.generarMailOptions(billete);
        await transporter.sendMail(mailOptions);
      }

      return { success: true, message: 'Correos enviados exitosamente.' };
    } catch (error) {
      console.error('Error al enviar correos:', error);
      throw error;
    }
  },

  async obtenerReservaConDetalles(id_reserva) {
    return Reserva.findOne({
      where: { id_reserva },
      include: [
        {
          model: Billete,
          as: 'billetes',
          include: [
            {
              model: Vuelo,
              as: 'vuelo',
              include: [
                { model: Aeropuerto, as: 'aeropuerto_origen' },
                { model: Aeropuerto, as: 'aeropuerto_destino' }
              ]
            },
            { model: Asiento, as: 'asiento' },
            { model: Pasajero, as: 'pasajero' }
          ]
        }
      ]
    });
  },

  generarMailOptions(billete) {
    const { pasajero, vuelo, asiento, localizador, precio } = billete;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <p style="font-size: 18px;">Hola <strong>${pasajero.nombre} ${pasajero.apellidos}</strong>,</p>
        <p style="font-size: 16px;">Aquí están los detalles de tu vuelo:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; border: 1px solid #ccc; border-radius: 8px;">
          ${this.generarFila('Vuelo', vuelo.numero_vuelo)}
          ${this.generarFila('Fecha de salida', vuelo.fecha_salida, true)}
          ${this.generarFila('Fecha de llegada', vuelo.fecha_llegada)}
          ${this.generarFila('Aeropuerto de origen', vuelo.aeropuerto_origen.nombre, true)}
          ${this.generarFila('Aeropuerto de llegada', vuelo.aeropuerto_destino.nombre)}
          ${this.generarFila('Asiento', `${asiento.codigo_asiento} (Fila: ${asiento.fila}, Columna: ${asiento.columna})`, true)}
          ${this.generarFila('Precio', `<strong>${precio} EUR</strong>`)}
          ${this.generarFila('Localizador', `<strong>${localizador}</strong>`, true)}
        </table>

        <p style="margin-top: 20px; font-size: 16px;">¡Gracias por volar con <strong>AirLink</strong>!</p>
      </div>
    `;

    return {
      from: process.env.EMAIL_USER,
      to: pasajero.email,
      subject: "Detalles de tu vuelo - AirLink",
      html
    };
  },

  generarFila(label, value, stripe = false) {
    const bgColor = stripe ? 'background-color: #f5f5f5;' : '';
    return `
      <tr style="${bgColor}">
        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">${label}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${value}</td>
      </tr>
    `;
  },


  async enviarCodigoVerificacion(email, nombre_usuario, codigo) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
          <p style="font-size: 18px;">Hola <strong>${nombre_usuario}</strong>,</p>
          <p style="font-size: 16px;">Hemos recibido una solicitud para verificar tu identidad y poder cambiar tu contraseña. Tu código de verificación es:</p>
          <div style="font-size: 28px; font-weight: bold; color: #1a73e8; margin: 20px 0;">${codigo}</div>
          <p style="font-size: 14px;">Este código expirará en 5 minutos. Si no has solicitado esta verificación, puedes ignorar este mensaje.</p>
          <p style="margin-top: 20px; font-size: 16px;">Atentamente,<br><strong>AirLink</strong></p>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Tu código de verificación - AirLink",
        html
      };

      await transporter.sendMail(mailOptions);
      return { success: true, message: "Correo de verificación enviado correctamente" };
    } catch (error) {
      console.error("Error al enviar el correo de verificación:", error);
      throw error;
    }
  },

};

module.exports = EmailService;
