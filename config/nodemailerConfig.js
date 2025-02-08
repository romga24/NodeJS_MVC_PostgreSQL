const nodemailer = require('nodemailer');
require('dotenv').config();

// Crear el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS   
  }
});

// Función para enviar un correo
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Correo de quien envía
    to: to,                        // Correo del destinatario
    subject: subject,              // Asunto
    text: text                     // Cuerpo del mensaje
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail
};
