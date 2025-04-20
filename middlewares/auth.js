
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarToken = (cliente) => {
  const payload = {
    sub: cliente.id_cliente,
    email: cliente.email,
    name: cliente.nombre_usuario,
    is_admin: !!cliente.es_admin,
  };
  const opciones = {
    expiresIn: '2h',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, opciones);
};

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const verificarAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    return next(); 
  }
  return res.status(403).json({ message: 'Acceso denegado. Usuario no autorizado.' });
};

module.exports = {
  generarToken,
  verificarToken,
  verificarAdmin
};

