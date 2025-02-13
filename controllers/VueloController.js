const VueloModel = require("../models/VueloModel"); 
const { accessToken } = require("../config/amadeusConfig");
const axios = require("axios");
const AMADEUS_FLIGHT_API = "https://test.api.amadeus.com/v2/shopping/flight-offers";

// Obtener todos los vuelos
exports.getAllVuelos = (req, res) => {
  VueloModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener los vuelos", details: err.message });
    res.status(200).json(results);
  });
};

// Obtener un vuelo por ID
exports.getVueloById = (req, res) => {
  const { id } = req.params;
  VueloModel.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener el vuelo", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vuelo no encontrado" });
    res.status(200).json(result);
  });
};

// Crear un nuevo vuelo
exports.createVuelo = (req, res) => {
  const { numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea } = req.body;

  if (!numero_vuelo || !id_aeropuerto_origen || !id_aeropuerto_destino || !fecha_salida || !fecha_llegada || !id_avion || !id_aerolinea) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const vueloData = { numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea };

  VueloModel.create(vueloData, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear el vuelo", details: err.message });
    res.status(200).json({ message: "Vuelo creado con éxito", id: result.insertId });
  });
};

// Actualizar un vuelo
exports.updateVuelo = (req, res) => {
  const { id } = req.params;
  const { numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea } = req.body;
  const vueloData = { numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea };

  VueloModel.update(id, vueloData, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar el vuelo", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vuelo no encontrado" });

    res.status(200).json({ message: "Vuelo actualizado con éxito" });
  });
};

// Eliminar un vuelo
exports.deleteVuelo = (req, res) => {
  const { id } = req.params;

  VueloModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar el vuelo", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vuelo no encontrado" });

    res.status(200).json({ message: "Vuelo eliminado con éxito" });
  });
};


// La función que maneja la búsqueda de vuelos
exports.buscarVuelos = async (req, res) => {
  try {
      // Obtenemos los parámetros de la solicitud
      const { origen, destino, salida, regreso, adultos, clase, escalas } = req.query;

      // Verificamos si los parámetros obligatorios están presentes
      if (!origen || !destino || !salida || !adultos) {
          return res.status(400).json({ error: "Faltan parámetros obligatorios" });
      }

      // Definimos los parámetros que se enviarán en la solicitud a la API
      const params = {
          originLocationCode: origen,          // Código IATA del aeropuerto de origen
          destinationLocationCode: destino,    // Código IATA del aeropuerto de destino
          departureDate: salida,               // Fecha de salida
          returnDate: regreso || null,         // Fecha de regreso (si no existe, se pasa como null)
          adults,                              // Número de adultos
          travelClass: clase || "ECONOMY",     // Clase de viaje (por defecto es "ECONOMY")
          nonStop: escalas === "true",         // Filtra vuelos sin escalas (booleano)
          max: 50,                             // Número máximo de resultados a obtener
      };

      // Verificamos si el token existe antes de hacer la solicitud
      if (!accessToken) {
          return res.status(400).json({ error: "El token de acceso no está disponible" });
      }

      // Realizamos la solicitud GET a la API de Amadeus
      const response = await axios.get(AMADEUS_FLIGHT_API, {
          params,
          headers: {
              Authorization: `Bearer ${accessToken}`,  // Usamos el token de acceso dinámico
              Accept: "application/vnd.amadeus+json",   // Aceptamos la respuesta en formato JSON
          },
      });

      // Limpiamos los datos de vuelos para dar la respuesta deseada
      const vuelos = limpiarDatosVuelos(response.data.data);
      res.json(vuelos);  // Enviamos la respuesta con los vuelos
  } catch (error) {
      // En caso de error, manejamos la excepción
      console.error("❌ Error buscando vuelos:", error.response?.data || error.message);
      res.status(500).json({ error: "Error buscando vuelos" });
  }
};

// Función que limpia y formatea los datos de los vuelos
exports.limpiarDatosVuelos = (data) => {
  return data.map((vuelo) => ({
      aerolinea: vuelo.validatingAirlineCodes[0],  // Código de la aerolínea
      precio: vuelo.price.grandTotal + " " + vuelo.price.currency,  // Precio total y su moneda
      itinerarios: vuelo.itineraries.map((itinerario) => ({
          duracion: itinerario.duration,  // Duración del itinerario
          segmentos: itinerario.segments.map((segmento) => ({
              origen: segmento.departure.iataCode,  // Código IATA del origen
              destino: segmento.arrival.iataCode,   // Código IATA del destino
              salida: segmento.departure.at,        // Hora de salida
              llegada: segmento.arrival.at,         // Hora de llegada
              vuelo: segmento.carrierCode + segmento.number,  // Número de vuelo
          })),
      })),
  }));
};
