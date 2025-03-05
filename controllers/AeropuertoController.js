const AeropuertoService = require("../services/AeropuertoService");

exports.getAllAeropuertos = async (req, res) => {
  try {
    const results = await AeropuertoService.getAll();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los aeropuertos"});
  }
};


