const clienteModel = require("../services/ClienteService"); 
const generarToken = require('./../middlewares/auth');
const crypto = require("crypto");
require("dotenv").config();

//okk
exports.getClienteById = async (req, res) => {
  try {
    const id_cliente = req.user.sub;
    const result = await clienteModel.getById(id_cliente);
    if (!result) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el cliente", details: err.message });
  }
};

//okk
exports.createCliente = async (req, res) => {
  try {
    const { nombre, apellidos, email, telefono, nif, contraseña, nombre_usuario } = req.body;
    if (!nombre || !apellidos || !email || !telefono || !nif || !contraseña || !nombre_usuario) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    
    const data = { nombre, apellidos, email, telefono, nif, contraseña, es_admin: false, nombre_usuario };
    await clienteModel.create(data);

    return res.status(201).json({ message: "Cliente creado con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error al crear el cliente", details: err.message });
  }
};

//ok
exports.loginCliente = async (req, res) => { 
  try {
    const { usuarioOEmail, contraseña } = req.body;
    const cliente = await clienteModel.login(usuarioOEmail, contraseña);  
    if (!cliente) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }   
    const token = generarToken.generarToken(cliente);
    const codigoVerificacion = crypto.randomInt(100000, 999999).toString().padStart(6, "0");
    if (!global.codigosVerificacion) {
      global.codigosVerificacion = new Map();
    }
    global.codigosVerificacion.set(cliente.id_cliente, {
      codigo: codigoVerificacion,
      expira: Date.now() + 5 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Inicio de sesión exitoso. Se ha enviado un código de verificación al correo.",
      token,
      estaLogueado: true,
    });
  } catch (err) {
    return res.status(500).json({ error: "Error al intentar iniciar sesión" });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const id_cliente = req.user.sub;
    const { nombre, apellidos, email, telefono, contraseña, nombre_usuario, es_admin } = req.body;
    const datosCliente = { nombre, apellidos, email, telefono, contraseña, nombre_usuario, es_admin };

    const result = await clienteModel.update(id_cliente, datosCliente);
    if (!result) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.status(200).json({ message: "Cliente actualizado con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el cliente", details: err.message });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const id_cliente = req.user.sub;
    const result = await clienteModel.deleteById(id_cliente);
    if (!result) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    return res.status(200).json({ message: "Cliente eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el cliente", details: err.message });
  }
};





