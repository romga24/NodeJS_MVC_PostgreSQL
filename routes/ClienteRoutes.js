const express = require("express");
const clienteController = require("../controllers/ClienteController");
const router = express.Router();

router.get("/", clienteController.getAllClientes);
router.get("/:id", clienteController.getClienteById);
router.post("/", clienteController.createCliente);
router.post("/login", clienteController.loginCliente);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);
router.post('/enviar-correo', clienteController.enviarCorreoACliente);

module.exports = router;

