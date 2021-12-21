const express = require('express');
const route = express.Router();

const RProduitControllers = require('../controllers/responsable-produit')

const {check} = require('express-validator')


route.post('/signup', 
check('name')
.not()
.isEmpty(),
check('email')
.normalizeEmail()
, RProduitControllers.signup)

route.post('/login', 

check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, RProduitControllers.login)

route.get('/',RProduitControllers.getResponsableProduit)

route.get('/:id',RProduitControllers.getResponsableProduitById)

route.patch('/:id',RProduitControllers.updateRP)

route.delete('/:id',RProduitControllers.deleteRP)


module.exports= route
