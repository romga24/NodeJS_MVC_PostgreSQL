const express = require("express");
const aeropuertoController = require("../controllers/AeropuertoController");
const router = express.Router();

// Definir las rutas directamente sin necesidad de .bind
router.get("/", aeropuertoController.getAllAeropuertos);       
router.get("/:id", aeropuertoController.getAeropuertoById);   
router.post("/", aeropuertoController.createAeropuerto);     
router.put("/:id", aeropuertoController.updateAeropuerto);    
router.delete("/:id", aeropuertoController.deleteAeropuerto);  

module.exports = router;

