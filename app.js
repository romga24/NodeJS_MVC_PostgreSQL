const express = require("express");
const cors = require("cors");

const routes = require("./routes/routes");
const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

// Configura las rutas
app.use("/api", routes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API!");
});

// Inicia el servidor
const port = process.env.PORT || 3006;
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});



