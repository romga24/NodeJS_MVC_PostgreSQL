const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

/*********************************************************
 * Rutas donde estan definidos los controladores
 ********************************************************/
const aeropuertoRoutes = require("./routes/AeropuertoRoutes");
const clienteRoutes = require("./routes/ClienteRoutes");


// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

/*********************************************************
 * Rutas para definir las APIs correspondientes
 ********************************************************/
app.use("/api/aeropuertos", aeropuertoRoutes);
app.use("/api/clientes", clienteRoutes)

// Ruta de prueba para la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de Aeropuertos!");
});

// ⬇️ CORRECCIÓN: Usa `0.0.0.0` para Render y `process.env.PORT`
const port = process.env.PORT || 3003;
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`);
});



