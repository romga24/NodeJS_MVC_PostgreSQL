const express = require("express");
const router = express.Router();
const aeropuertoController = require("../controllers/AeropuertoController");

// Rutas AeropuertoController
router.get("/", aeropuertoController.getAllAeropuertos.bind(aeropuertoController));       
router.get("/:id", aeropuertoController.getAeropuertoById.bind(aeropuertoController));   
router.post("/", aeropuertoController.createAeropuerto.bind(aeropuertoController));     
router.put("/:id", aeropuertoController.updateAeropuerto.bind(aeropuertoController));    
router.delete("/:id", aeropuertoController.deleteAeropuerto.bind(aeropuertoController));  

module.exports = router; 
