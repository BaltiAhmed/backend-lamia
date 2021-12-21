const express = require("express");
const route = express.Router();

const demandeRetourArticleController = require("../controllers/demandeRetourArticle");

route.post("/ajout", demandeRetourArticleController.ajout);
route.get("/", demandeRetourArticleController.getDemandeRetourArticle);
route.patch(
  "/suprimerArticleCommande",
  demandeRetourArticleController.SuprimerArticleCommande
);

module.exports = route;
