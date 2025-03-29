const express = require("express");
const router = express.Router();

/************************CONTROLADORES*********************************/
const clienteController = require("../controllers/ClienteController");
const aeropuertoController = require("../controllers/AeropuertoController");
const vueloController = require("../controllers/VueloController");
const asientoController = require("../controllers/AsientoController");
const reservaController = require("../controllers/ReservaController");
const billeteController = require("../controllers/BilleteController");
const aerolineaController = require("../controllers/AerolineaController");
const avionController = require("../controllers/AvionController");
const { verificarToken, verificarAdmin } = require('./../controllers/AuthController');

/************************RUTA CLIENTE CONTROLLER*********************************/
router.get("/clientes/perfil-cliente",  verificarToken, clienteController.getClienteById); //ok
router.post("/clientes", clienteController.createCliente); //ok
router.post("/clientes/login", clienteController.loginCliente); //ok
router.put("/clientes/actualizar-datos-cliente", verificarToken, clienteController.updateCliente); //ok
router.delete("/clientes/:eliminar-cuenta", verificarToken, clienteController.deleteCliente); //ok
//router.post('/clientes/verificar-codigo', verificarToken, clienteController.verificarCodigo);

/************************RUTA VUELO CONTROLLER*********************************/
router.get('/vuelos/buscador-vuelos', vueloController.getVuelosConFiltro);
/*Solo el administrador puede crear los vuelos*/
router.post('/vuelos', verificarToken, verificarAdmin, vueloController.createVuelo);
router.get('/vuelos', vueloController.getAllVuelos); //ok
router.put('/vuelos/modificar-estado-vuelo', vueloController.modificarEstadoVuelo);

/************************RUTA AEROLINEAS CONTROLLER*********************************/
router.get('/aerolineas', aerolineaController.getAllAerolineas);

/************************RUTA AVIONES CONTROLLER*********************************/
router.get('/aviones', avionController.getAllAviones);

/************************RUTA AEROPUERTO CONTROLLER*********************************/
router.get("/aeropuertos", aeropuertoController.getAllAeropuertos); //ok

/************************RUTA ASIENTO CONTROLLER*********************************/
router.get('/asientos/vuelo/:numero_vuelo', asientoController.getAsientosByVuelo);

/************************RUTA RESERVA CONTROLLER*********************************/
router.put('/reservas/realizar-reserva', verificarToken, reservaController.realizarReserva);
router.put('/reservas/realizar-reserva-aleatoria', verificarToken, reservaController.realizarReservaConAsignacionAleatoria);
router.get('/reservas/mis-reservas', verificarToken, reservaController.obtenerReservaCliente);
router.delete('/reservas/:id_reserva', verificarToken, reservaController.eliminarReservaCliente);
router.delete('/reservas/:id_reserva/billetes/:id_billete', verificarToken, reservaController.eliminarBilleteDeReserva);

/************************RUTA BILLETE CONTROLLER*********************************/
router.get('/billetes/obtener-info-vuelo', billeteController.obtenerInfoPorLocalizador);

module.exports = router;
