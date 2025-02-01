const express = require("express");
const router = express.Router();
const aeropuertoController = require("../controllers/aeropuertoController"); // Importando el controlador

// Rutas
router.get("/", aeropuertoController.getAllAeropuertos);       // Obtener todos los aeropuertos
router.get("/:id", aeropuertoController.getAeropuertoById);    // Obtener un aeropuerto por ID
router.post("/", aeropuertoController.createAeropuerto);       // Crear un nuevo aeropuerto
router.put("/:id", aeropuertoController.updateAeropuerto);    // Actualizar un aeropuerto por ID
router.delete("/:id", aeropuertoController.deleteAeropuerto); // Eliminar un aeropuerto por ID

module.exports = router; // Exportando el router para usarlo en el archivo principal
