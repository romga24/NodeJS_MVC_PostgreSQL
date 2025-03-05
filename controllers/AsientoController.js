
const AsientoService = require("../services/AsientoService");

exports.getAsientosByVuelo = async (req, res) => {
  try {
      const { numero_vuelo } = req.params;
      if (!numero_vuelo) {
          return res.status(400).json({ error: 'Número de vuelo es requerido' });
      }
      const asientos = await AsientoService.getAllAsientos(numero_vuelo);
      return res.status(200).json(asientos);
  } catch (error) {
      return res.status(500).json({ error: "Problema al devolver los asientos"});
  }
};
