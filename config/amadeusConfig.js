const Amadeus = require('amadeus');
require('dotenv').config();

// Configura el cliente de Amadeus con las variables de entorno
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

module.exports = amadeus; // Exporta el cliente configurado