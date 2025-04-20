const { Aeropuerto } = require("../models");

const AeropuertoService = { 
  async getAll() {
    try {
      return await Aeropuerto.findAll();
    } catch (error) {
      console.error("Error al obtener los aeropuertos:", error);
      throw new Error("Error al obtener los aeropuertos.");
    }
  }
};

module.exports = AeropuertoService;
