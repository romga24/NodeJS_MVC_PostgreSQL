const express = require("express");
const cors = require("cors"); // Importar CORS
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const aeropuertoRoutes = require("./routes/aeropuertoRoutes");

// Middleware para CORS - Permitir acceso desde cualquier origen
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de aeropuerto
app.use("/api/aeropuertos", aeropuertoRoutes);

// Ruta de prueba para la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de Aeropuertos!");
});

module.exports = app;

