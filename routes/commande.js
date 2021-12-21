const express = require('express');
const route = express.Router();

const commandeControllers = require('../controllers/commande')




route.post('/ajout', commandeControllers.ajout)
route.get('/',commandeControllers.getCommande)
route.get('/:id',commandeControllers.getCommandeById)
route.get('/user/:id',commandeControllers.getCommandeByUser)
route.post('/article/:id',commandeControllers.ajoutArticleToCommande)
route.patch('/valider/:id',commandeControllers.validerCommande)




module.exports = route