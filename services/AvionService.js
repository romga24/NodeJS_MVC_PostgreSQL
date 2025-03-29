const { Avion } = require('../models');

const AvionService = {
  async getAllAviones() {
    try {
      const aviones = await Avion.findAll();
      return aviones;
    } catch (error) {
      console.error('Error al obtener los aviones:', error);
      throw new Error('Error al obtener los aviones.');
    }
  }
};

module.exports = AvionService;
