const express = require("express");
const clienteController = require("../controllers/ClienteController");
const router = express.Router();

router.get("/", clienteController.getAllClientes.bind(clienteController));
router.get("/:id", clienteController.getClienteById.bind(clienteController));
router.post("/", clienteController.createCliente.bind(clienteController));
router.post("/login", clienteController.loginCliente.bind(clienteController));
router.put("/:id", clienteController.updateCliente.bind(clienteController));
router.delete("/:id", clienteController.deleteCliente.bind(clienteController));
router.post('/enviar-correo', clienteController.enviarCorreoACliente);

module.exports = router;

