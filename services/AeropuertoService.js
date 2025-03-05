
const { Aeropuerto } = require("../models");

const AeropuertoService = {
  
  async getAll() {
    try {
      return await Aeropuerto.findAll();
    } catch (error) {
      console.error("Error al obtener los aeropuertos:", error);
      throw new Error("Error al obtener los aeropuertos.");
    }
  },
 
  async getByCodigoIata(codigoIata) {
    try {
      const aeropuerto = await Aeropuerto.findOne({ where: { codigo_iata: codigoIata } });
      if (!aeropuerto) {
        throw new Error("Aeropuerto no encontrado.");
      }
      return aeropuerto; 
    } catch (error) {
      console.error("Error al obtener el aeropuerto por codigo_iata:", error);
      throw new Error("Error al obtener el aeropuerto por codigo_iata.");
    }
  },
};

module.exports = AeropuertoService;
