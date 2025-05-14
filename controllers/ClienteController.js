const clienteModel = require("../services/ClienteService"); 
const generarToken = require('./../middlewares/auth');
const EmailService = require("../services/EmailService");

const crypto = require("crypto");

require("dotenv").config();

global.codigosVerificacion = global.codigosVerificacion || new Map();

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

exports.loginCliente = async (req, res) => { 
  try {
    const { usuarioOEmail, contraseña } = req.body;
    const cliente = await clienteModel.login(usuarioOEmail, contraseña);  
    if (!cliente) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }   
    const token = generarToken.generarToken(cliente);
    return res.status(200).json({
      message: "Inicio de sesión exitoso", token, estaLogueado: true,
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

// Enviar código de recuperación al email
exports.enviarCodigoRecuperacion = async (req, res) => {
  try {
    const { emailOUsuario } = req.body;
    
    if (!emailOUsuario) return res.status(400).json({ message: "El email o el nombre de usuario es requerido" });
    const cliente = await clienteModel.getByEmailOUsuario(emailOUsuario);
  
    if (!cliente) return res.status(404).json({ message: "No existe un cliente con ese email o el nombre de usuario" });
    const codigo = crypto.randomInt(100000, 999999).toString().padStart(6, "0");
    
    global.codigosVerificacion.set(codigo, {
      id_cliente: cliente.id_cliente,
      expira: Date.now() + 5 * 60 * 1000 // 5 minutos
    });

    await EmailService.enviarCodigoVerificacion(cliente.email, cliente.nombre_usuario, codigo);

    return res.status(200).json({ message: "Código enviado al correo electrónico" });

  } catch (err) {
    return res.status(500).json({ error: "Error al enviar el código" });
  }
};

exports.verificarCodigoRecuperacion = async (req, res) => {
  try {
    const { codigo } = req.body;
    
    if (!codigo) {
      return res.status(400).json({ message: "El código es requerido" });
    }

    const registro = global.codigosVerificacion?.get(codigo);

    if (!registro) {
      return res.status(400).json({ message: "Código no encontrado o expirado" });
    }

    if (registro.expira < Date.now()) {
      global.codigosVerificacion.delete(codigo);
      return res.status(400).json({ message: "Código expirado" });
    }
    
    const cliente = await clienteModel.getById(registro.id_cliente);
    global.codigosVerificacion.delete(codigo); // eliminar para evitar reuso
    const token = generarToken.generarToken(cliente);

    return res.status(200).json({ 
      message: "Codigo verificado con éxito",  
      token: token, 
      estaLogueado: true
    });

  } catch (err) {
    return res.status(500).json({
      error: "Error al verificar el código",
      details: err.message,
    });
  }
};

exports.restablecerContrasena = async (req, res) => {
  try {
    const { nueva_contrasena } = req.body;
    const id_cliente = req.user.sub;

    if (!nueva_contrasena) {
      return res.status(400).json({ message: "Faltan datos necesarios" });
    }

    const actualizado = await clienteModel.update(id_cliente, { contraseña: nueva_contrasena });

    if (!actualizado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.status(200).json({ message: "Contraseña restablecida correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al restablecer la contraseña", error: error.message });
  }
};







