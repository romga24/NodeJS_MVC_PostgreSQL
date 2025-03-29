
const AvionService = require("../services/AvionService");

exports.getAllAviones = async (req, res) => {
  try {
    const results = await AvionService.getAllAviones();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los aeropuertos"});
  }
};