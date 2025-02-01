const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config(); // Para leer variables de entorno desde un archivo .env
const aeropuertoRoutes = require("./routes/aeropuertoRoutes"); // Importando las rutas de aeropuerto

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de aeropuerto
app.use("/api/aeropuertos", aeropuertoRoutes); // Prefijo '/api/aeropuertos'

// Ruta de prueba para la raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Aeropuertos!');
});

// Iniciar el servidor
const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

