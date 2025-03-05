const express = require("express");
const router = express.Router();


/************************CONTROLADORES*********************************/
const clienteController = require("../controllers/ClienteController");
const aeropuertoController = require("../controllers/AeropuertoController");
const vueloController = require("../controllers/VueloController");
const asientoController = require("../controllers/AsientoController");
const reservaController = require("../controllers/ReservaController");
const billeteController = require("../controllers/BilleteController");
const { verificarToken } = require('./../controllers/AuthController');

/************************RUTA CLIENTE CONTROLLER*********************************/
router.get("/clientes/perfil-cliente",  verificarToken, clienteController.getClienteById); //ok
router.post("/clientes", clienteController.createCliente); //ok
router.post("/clientes/login", clienteController.loginCliente); //ok
router.put("/clientes/actualizar-datos-cliente", verificarToken, clienteController.updateCliente); //ok
router.delete("/clientes/:eliminar-cuenta", verificarToken, clienteController.deleteCliente); //ok
router.post('/clientes/verificar-codigo', verificarToken, clienteController.verificarCodigo);

/************************RUTA VUELO CONTROLLER*********************************/
router.get('/vuelos', vueloController.getAllVuelos);
router.get('/vuelos/filtro/:id_vuelo', vueloController.getVueloById);
router.post('/vuelos', vueloController.createVuelo);
router.put('/vuelos/filtro/:id_vuelo', vueloController.updateVuelo);
router.delete('/vuelos/filtro/:numero_vuelo', vueloController.deleteVuelo);
router.get('/vuelos/buscador-vuelos', vueloController.getVuelosConFiltro);

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
