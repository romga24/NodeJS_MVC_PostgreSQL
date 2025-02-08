const clienteModel = require("../models/ClienteModel"); // Asegúrate de importar correctamente el modelo.
const emailService = require("../config/nodemailerConfig"); // Asegúrate de tener un servicio para el envío de correos

class ClienteController {
  
  // Obtener todos los clientes
  getAllClientes(req, res) {
    clienteModel.getAll((err, results) => {  // Cambié Cliente por clienteModel
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    });
  }

  // Obtener un cliente por ID
  getClienteById(req, res) {
    const { id } = req.params;
    clienteModel.getById(id, (err, result) => {  // Cambié Cliente por clienteModel
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: "Cliente no encontrado" });
      res.status(200).json(result[0]);
    });
  }

  // Crear un nuevo cliente
  createCliente(req, res) {
    const { nombre, apellidos, email, telefono, nif, contraseña, nombre_usuario } = req.body;

    if (!nombre || !apellidos || !email || !telefono || !nif || !contraseña || !nombre_usuario) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const data = { nombre, apellidos, email, telefono, nif, contraseña, es_admin: false, nombre_usuario };

    clienteModel.create(data, (err, result) => {  // Cambié Cliente por clienteModel
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Cliente creado con éxito", id: result.insertId });
    });
  }

  // Login de cliente
  loginCliente(req, res) {
    const { usuarioOEmail, contraseña } = req.body;
    if (!usuarioOEmail || !contraseña) {
      return res.status(400).json({ message: "Usuario/Email y contraseña son requeridos" });
    }

    clienteModel.login(usuarioOEmail, contraseña, (err, response) => {  // Cambié Cliente por clienteModel
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(response);
    });
  }

  // Actualizar un cliente
  updateCliente(req, res) {
    const { id } = req.params;
    const data = req.body;

    clienteModel.update(id, data, (err, result) => {  // Cambié Cliente por clienteModel
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });

      res.status(200).json({ message: "Cliente actualizado con éxito" });
    });
  }

  // Eliminar un cliente
  deleteCliente(req, res) {
    const { id } = req.params;

    clienteModel.delete(id, (err, result) => {  // Cambié Cliente por clienteModel
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });

      res.status(200).json({ message: "Cliente eliminado con éxito" });
    });
  }

  // Enviar correo bonito (HTML) a un cliente
enviarCorreoACliente(req, res) {
  // Obtenemos los parámetros de la URL, no del body (porque es un GET)
  const { email, asunto, mensaje } = req.query;

  // Verificamos que se reciban los parámetros correctos
  if (!email || !asunto || !mensaje) {
    return res.status(400).json({ message: "El correo, asunto y mensaje son requeridos" });
  }

  // Creamos el cuerpo del correo en formato HTML
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

  // Usamos el servicio de correo para enviar el email
  emailService.sendEmail(email, asunto, htmlBody)
    .then((info) => {
      res.status(200).json({ message: "Correo enviado con éxito", info: info });
    })
    .catch((err) => {
      res.status(500).json({ error: "Error al enviar el correo", details: err.message });
    });
}

}

module.exports = new ClienteController();
