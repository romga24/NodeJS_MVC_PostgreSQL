const express = require("express");
const clienteController = require("../controllers/ClienteController");

const router = express.Router();


// Rutas ClienteController
router.get("/", clienteController.getAllClientes.bind(ClienteController));
router.get("/:id", clienteController.getClienteById.bind(ClienteController));
router.post("/", clienteController.createCliente.bind(ClienteController));
router.post("/login", clienteController.loginCliente.bind(ClienteController));
router.put("/:id", clienteController.updateCliente.bind(ClienteController));
router.delete("/:id", clienteController.deleteCliente.bind(ClienteController));
router.post('/enviar-correo', clienteController.enviarCorreoACliente);

module.exports = router;

