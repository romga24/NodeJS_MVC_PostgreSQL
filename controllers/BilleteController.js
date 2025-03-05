const BilleteService = require('../services/BilleteService');

const BilleteController = {

  async obtenerInfoPorLocalizador(req, res) {
    const { localizador, apellido } = req.body;
  
    try {
      // Validar que ambos campos son proporcionados
      if (!localizador || !apellido) {
        return res.status(400).json({
          success: false,
          message: 'Se deben proporcionar tanto el localizador como los apellidos.'
        });
      }
  
      // Llamar al servicio para obtener la información del billete
      const resultado = await BilleteService.obtenerInfoBillete(localizador, apellido);
  
      // Si no se encuentra el billete, retornar un error
      if (!resultado.success) {
        return res.status(404).json({
          success: false,
          message: resultado.message || 'Billete no encontrado con ese localizador o apellido.'
        });
      }
  
      // Retornar los datos del billete encontrado
      return res.status(200).json({
        success: true,
        data: resultado.data
      });
  
    } catch (error) {
      console.error('Error en el controlador al obtener el billete:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
};

module.exports = BilleteController;
