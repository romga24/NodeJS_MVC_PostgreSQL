// routes/AeropuertoRoutes.js
const express = require('express');
const router = express.Router();
const aeropuertoController = require('../controllers/AeropuertoController');

// Define tus rutas aquí, ejemplo:
router.get('/', aeropuertoController.getAllAeropuertos);
router.get('/:id', aeropuertoController.getAeropuertoById);
router.post('/', aeropuertoController.createAeropuerto);
router.put('/:id', aeropuertoController.updateAeropuerto);
router.delete('/:id', aeropuertoController.deleteAeropuerto);

module.exports = router;

