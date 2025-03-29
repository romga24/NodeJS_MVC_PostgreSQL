
const { Aerolinea } = require("../models");

const AerolineaService = {
  async getAllAerolineas() {
    try {
      return await Aerolinea.findAll(); 
    } catch (error) {
      console.error("Error al obtener las aerolíneas:", error);
      throw new Error("Error al obtener las aerolíneas.");
    }
  }
};

module.exports = AerolineaService;