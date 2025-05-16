const transporter = require('../config/nodemailer');
const ReservaService = require('../services/ReservaService');
const ejs = require('ejs');
const path = require('path');

const EmailService = {
  
  async enviarCorreoVuelo(id_reserva) {
    try {  
      const reserva = await ReservaService.obtenerReservaConDetalles(id_reserva);
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

  async generarMailOptions(billete) {
    const templatePath = path.join(__dirname, '../views/emails/detalleVuelo.ejs');
    const logoPath = path.join(__dirname, '../public/images/airlink_logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;

    try{
       const html = await ejs.renderFile(templatePath, { billete, logoDataUrl });
       return {
          from: process.env.EMAIL_USER,
          to: billete.pasajero.email,
          subject: "Detalles de tu vuelo - AirLink",
          html
       };
    }catch (error){
        throw error;
    } 
  },

  async renderCodigoVerificacionHtml(nombre_usuario, codigo) {
    const templatePath = path.join(__dirname, '../templates/codigoVerificacion.ejs');
    try {
      const html = await ejs.renderFile(templatePath, { nombre_usuario, codigo });
      return html;
    } catch (error) {
      throw error;
    }
}
};

module.exports = EmailService;
