const clienteModel = require("../models/ClienteModel"); // Importa el modelo
const emailService = require("../config/nodemailerConfig"); // Servicio para el envío de correos

// Obtener todos los clientes
exports.getAllClientes = (req, res) => {
  clienteModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener los clientes", details: err.message });
    res.status(200).json(results);
  });
};

// Obtener un cliente por ID
exports.getClienteById = (req, res) => {
  const { id } = req.params;
  clienteModel.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener el cliente", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json(result);
  });
};

exports.createCliente = (req, res) => {
  const { nombre, apellidos, email, telefono, nif, contraseña, nombre_usuario } = req.body;

  if (!nombre || !apellidos || !email || !telefono || !nif || !contraseña || !nombre_usuario) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const data = { nombre, apellidos, email, telefono, nif, contraseña, es_admin: false, nombre_usuario };

  clienteModel.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear el cliente", details: err.message });
    res.status(200).json({ message: "Cliente creado con éxito", id: result.insertId });
  });
};

exports.loginCliente = (req, res) => {
  const { usuarioOEmail, contraseña } = req.body;  
  if (!usuarioOEmail || !contraseña) {
    return res.status(400).json({ message: "Usuario/Email y contraseña son requeridos" });
  }
  clienteModel.login(usuarioOEmail, contraseña, (err, response) => {
    if (err) return res.status(500).json({ error: "Error al intentar iniciar sesión", details: err.message });
    if (!response) return res.status(401).json({ message: "Credenciales incorrectas" });
    res.status(200).json({ message: "Credenciales correctas" });
  });
};

exports.updateCliente = (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, email, telefono, nif, contraseña, nombre_usuario, es_admin } = req.body;
  let datosCliente = { nombre, apellidos, email, telefono, nif, contraseña, nombre_usuario, es_admin };

  clienteModel.update(id, datosCliente, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar el cliente", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });

    res.status(200).json({ message: "Cliente actualizado con éxito" });
  });
};

exports.deleteCliente = (req, res) => {
  const { id } = req.params;

  clienteModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar el cliente", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });

    res.status(200).json({ message: "Cliente eliminado con éxito" });
  });
};


exports.enviarCorreoACliente = (req, res) => {
  const { email, asunto, mensaje } = req.body;

  if (!email || !asunto || !mensaje) {
    return res.status(400).json({ message: "El correo, asunto y mensaje son requeridos" });
  }

  emailService.sendEmail(email, asunto, mensaje)
    .then((info) => {
      res.status(200).json({ message: "Correo enviado con éxito", info: info });
    })
    .catch((err) => {
      res.status(500).json({ error: "Error al enviar el correo", details: err.message });
    });
};



