const BilleteService = require('../services/BilleteService');

const BilleteController = {
  async obtenerInfoPorLocalizador(req, res) {
    const { localizador, apellido } = req.body; 
    try {
      if (!localizador || !apellido) {
        return res.status(400).json({
          success: false,
          message: 'Se deben proporcionar tanto el localizador como los apellidos.'
        });
      }
      const resultado = await BilleteService.obtenerInfoBillete(localizador, apellido);
      if (!resultado.success) {
        return res.status(404).json({
          success: false,
          message: resultado.message || 'Billete no encontrado con ese localizador o apellido.'
        });
      }
      return res.status(200).json({ success: true, data: resultado.data });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
};

module.exports = BilleteController;
