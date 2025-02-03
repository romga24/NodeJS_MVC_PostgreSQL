const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const aeropuertoRoutes = require("./routes/aeropuertoRoutes");

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de aeropuerto
app.use("/api/aeropuertos", aeropuertoRoutes);

// Ruta de prueba para la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de Aeropuertos!");
});

// ⬇️ CORRECCIÓN: Usa `0.0.0.0` para Render y `process.env.PORT`
const port = process.env.PORT || 3003;
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`);
});



