const express = require("express");
const vueloController = require("../controllers/VueloController");  
const router = express.Router();

router.get("/", vueloController.getAllVuelos);
router.get("/:id", vueloController.getVueloById);
router.post("/", vueloController.createVuelo);
router.put("/:id", vueloController.updateVuelo);
router.delete("/:id", vueloController.deleteVuelo);
router.get("/search", vueloController.searchVuelos);

module.exports = router;
