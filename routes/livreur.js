const express = require("express");
const route = express.Router();

const livreurControllers = require("../controllers/livreur");

route.post("/ajout", livreurControllers.ajout);
route.get("/", livreurControllers.getLivreur);
route.patch("/:id", livreurControllers.updateLivreur);
route.delete("/:id", livreurControllers.deleteLivreur);

module.exports = route;
