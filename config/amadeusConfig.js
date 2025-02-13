const axios = require("axios");
require("dotenv").config();

const AMADEUS_API_URL = "https://test.api.amadeus.com/v1"; // Cambia a producción si es necesario
let accessToken = null;

// Obtener el token de acceso de Amadeus
const getAccessToken = async () => {
  try {
    const response = await axios.post(`${AMADEUS_API_URL}/security/oauth2/token`, null, {
      params: {
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET,
      },
    });
    accessToken = response.data.access_token;
    console.log("✅ Token obtenido correctamente");
  } catch (error) {
    console.error("❌ Error obteniendo el token:", error.response?.data || error.message);
  }
};

// Función para buscar vuelos por precio
const searchFlights = async (origin, destination, departureDate, maxPrice) => {
  if (!accessToken) await getAccessToken(); // Asegurarse de que el token está disponible

  try {
    const response = await axios.get(`${AMADEUS_API_URL}/shopping/flight-offers`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        maxPrice, // Filtrar por precio máximo
        adults: 1,
        currencyCode: "USD",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("❌ Error buscando vuelos:", error.response?.data || error.message);
    return null;
  }
};

module.exports = { searchFlights };
