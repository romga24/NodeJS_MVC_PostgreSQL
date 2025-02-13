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

exports.buscarVuelos = async (req, res) => {
    try {
        const { origen, destino, salida, regreso, adultos, clase, escalas } = req.query;

        if (!origen || !destino || !salida || !adultos) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios" });
        }

        const params = {
            originLocationCode: origen,
            destinationLocationCode: destino,
            departureDate: salida,
            returnDate: regreso || null,
            adults,
            travelClass: clase || "ECONOMY",
            nonStop: escalas === "true",
            max: 50,
        };

        const response = await axios.get(AMADEUS_FLIGHT_API, {
            params,
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const vuelos = limpiarDatosVuelos(response.data.data);
        res.json(vuelos);
    } catch (error) {
        console.error("❌ Error buscando vuelos:", error.response?.data || error.message);
        res.status(500).json({ error: "Error buscando vuelos" });
    }
};

exports.limpiarDatosVuelos = (data) => {
    return data.map((vuelo) => ({
        aerolinea: vuelo.validatingAirlineCodes[0],
        precio: vuelo.price.grandTotal + " " + vuelo.price.currency,
        itinerarios: vuelo.itineraries.map((itinerario) => ({
            duracion: itinerario.duration,
            segmentos: itinerario.segments.map((segmento) => ({
                origen: segmento.departure.iataCode,
                destino: segmento.arrival.iataCode,
                salida: segmento.departure.at,
                llegada: segmento.arrival.at,
                vuelo: segmento.carrierCode + segmento.number,
            })),
        })),
    }));
};
