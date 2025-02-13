const express = require("express");
const cors = require("cors");
const aeropuertoRoutes = require("./routes/AeropuertoRoutes");
const clienteRoutes = require("./routes/ClienteRoutes");
const vuelosRoutes = require("./routes/VueloRoutes")


const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

// Configura las rutas
app.use("/api/aeropuertos", aeropuertoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/vuelos", vuelosRoutes);



// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API!");
});

// Inicia el servidor
const port = process.env.PORT || 3003;
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});



