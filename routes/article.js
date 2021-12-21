const express = require('express');
const route = express.Router();

const articleControllers = require('../controllers/article')
const fileUpload = require("../middleware/file-uploads");

route.patch('/:id',fileUpload.single("image"),articleControllers.updateArticle)


route.post('/ajout',fileUpload.single("image"), articleControllers.ajout)
route.get('/',articleControllers.getArticle)
route.get('/:id',articleControllers.getArticleById)

route.delete('/:id',articleControllers.deleteArticle)

route.post('/ajoutPanier',articleControllers.ajoutArticlePanier)
route.post('/supprimerPanier',articleControllers.SuprimerArticlePanier)
route.get('/panier/:id',articleControllers.getarticleByPanier)
route.get('/commande/:id',articleControllers.getarticleByCommande)


module.exports = route