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

module.exports = transporter;


