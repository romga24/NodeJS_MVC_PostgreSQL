const axios = require("axios");
require("dotenv").config();

const AMADEUS_API_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
let accessToken = null;

const getAccessToken = async () => {
    try {
        const response = await axios.post(AMADEUS_API_URL, null, {
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

// Obtener el token al iniciar
getAccessToken();

// Refrescar el token cada 30 minutos
setInterval(getAccessToken, 30 * 60 * 1000);

module.exports = { getAccessToken, accessToken };
