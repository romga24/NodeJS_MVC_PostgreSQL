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
const { verificarToken, verificarAdmin } = require('./../middlewares/auth');

/************************RUTA CLIENTE CONTROLLER*********************************/
router.get("/clientes/perfil-cliente",  verificarToken, clienteController.getClienteById); 
router.post("/clientes", clienteController.createCliente); 
router.post("/clientes/login", clienteController.loginCliente);
router.put("/clientes/actualizar-datos-cliente", verificarToken, clienteController.updateCliente); 
router.delete("/clientes/eliminar-cuenta", verificarToken, clienteController.deleteCliente); 

/******APIs necesarias para la recuperacion de la contraseña*********/
router.post("/clientes/enviar-codigo", clienteController.enviarCodigoRecuperacion);
router.post("/clientes/verificar-codigo", clienteController.verificarCodigoRecuperacion);
router.post("/clientes/restablecer-contrasena", verificarToken, clienteController.restablecerContrasena);

/************************RUTA VUELO CONTROLLER*********************************/
router.post('/vuelos/buscador-vuelos', vueloController.getVuelosConFiltro);
router.get('/vuelos', vueloController.getAllVuelos); //ok

/*Solo el administrador*/
router.post('/vuelos/crear', verificarToken, verificarAdmin, vueloController.createVuelo);
router.put('/vuelos/modificar-estado-vuelo',verificarToken, verificarAdmin, vueloController.modificarEstadoVuelo); 

/************************RUTA AEROLINEAS CONTROLLER*********************************/
router.get('/aerolineas', aerolineaController.getAllAerolineas);

/************************RUTA AVIONES CONTROLLER*********************************/
router.get('/aviones', avionController.getAllAviones);

/************************RUTA AEROPUERTO CONTROLLER*********************************/
router.get("/aeropuertos", aeropuertoController.getAllAeropuertos); //ok

/************************RUTA ASIENTO CONTROLLER*********************************/
router.get('/asientos/vuelo/:numero_vuelo', verificarToken, asientoController.getAsientosByVuelo);

/************************RUTA RESERVA CONTROLLER*********************************/
router.put('/reservas/realizar-reserva', verificarToken, reservaController.realizarReserva);
router.get('/reservas/mis-reservas', verificarToken, reservaController.obtenerReservaCliente);
router.get('/reservas/:id_reserva/pdf',  verificarToken, reservaController.generarPdfVuelo);

router.delete('/reservas/:id_reserva', verificarToken, reservaController.eliminarReservaCliente); // -> Eliminar la reserva completa del cliente 
router.delete('/reservas/:id_reserva/billetes/:id_billete', verificarToken, reservaController.eliminarBilleteDeReserva); // -> Elimina un billete asociado a una reserva


module.exports = router;
