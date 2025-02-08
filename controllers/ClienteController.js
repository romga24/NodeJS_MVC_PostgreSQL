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

// Crear un nuevo cliente
exports.createCliente = (req, res) => {
  const { nombre, apellidos, email, telefono, nif, contraseña, nombre_usuario } = req.body;

  // Validación de los campos obligatorios
  if (!nombre || !apellidos || !email || !telefono || !nif || !contraseña || !nombre_usuario) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const data = { nombre, apellidos, email, telefono, nif, contraseña, es_admin: false, nombre_usuario };

  clienteModel.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear el cliente", details: err.message });
    res.status(201).json({ message: "Cliente creado con éxito", id: result.insertId });
  });
};

// Login de cliente
exports.loginCliente = (req, res) => {
  const { usuarioOEmail, contraseña } = req.body;
  
  if (!usuarioOEmail || !contraseña) {
    return res.status(400).json({ message: "Usuario/Email y contraseña son requeridos" });
  }

  clienteModel.login(usuarioOEmail, contraseña, (err, response) => {
    if (err) return res.status(500).json({ error: "Error al intentar iniciar sesión", details: err.message });
    if (!response) return res.status(401).json({ message: "Credenciales incorrectas" });
    res.status(200).json(response);
  });
};

// Actualizar un cliente
exports.updateCliente = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  clienteModel.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar el cliente", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });

    res.status(200).json({ message: "Cliente actualizado con éxito" });
  });
};

// Eliminar un cliente
exports.deleteCliente = (req, res) => {
  const { id } = req.params;

  clienteModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar el cliente", details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });

    res.status(200).json({ message: "Cliente eliminado con éxito" });
  });
};

// Enviar correo bonito (HTML) a un cliente
exports.enviarCorreoACliente = (req, res) => {
  const { email, asunto, mensaje } = req.query;

  // Verificar que se reciban los parámetros necesarios
  if (!email || !asunto || !mensaje) {
    return res.status(400).json({ message: "El correo, asunto y mensaje son requeridos" });
  }

  // Crear el cuerpo del correo en formato HTML
  const htmlBody = `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <h2 style="color: #333;">${asunto}</h2>
          <p style="color: #555;">${mensaje}</p>
          <p style="color: #777; font-size: 12px;">Este es un correo generado automáticamente. Si no deseas recibir más correos, por favor ignóralo.</p>
        </div>
      </body>
    </html>
  `;

  // Enviar el correo usando el servicio de nodemailer
  emailService.sendEmail(email, asunto, htmlBody)
    .then((info) => {
      res.status(200).json({ message: "Correo enviado con éxito", info: info });
    })
    .catch((err) => {
      res.status(500).json({ error: "Error al enviar el correo", details: err.message });
    });
};



