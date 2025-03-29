const AerolineaService = require("../services/AerolineaService");

exports.getAllAerolineas = async (req, res) => {
  try {
    const results = await AerolineaService.getAllAerolineas();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las aerolíneas" });
  }
};
