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

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS   
  }
});

const sendEmail =(to, nombre_usuario, codigo_verificacion) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: to,                        
    subject: "Código de Verificación",              
    html: `
          <p>Hola ${nombre_usuario},</p>
          <p>Tu código de verificación es: <strong>${codigo_verificacion}</strong>.</p>
          <p>Este código expira en 5 minutos.</p>
          <p>Saludos,<br>El equipo de soporte de AirLink</p>
        `                     
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail
};
