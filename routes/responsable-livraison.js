const express = require('express');
const route = express.Router();

const RLivraisonControllers = require('../controllers/responsable-livraison')

const { check } = require('express-validator')


route.post('/signup',
    check('name')
        .not()
        .isEmpty(),
    check('email')
        .normalizeEmail()
    , RLivraisonControllers.signup)

route.post('/login',

    check('email')
        .normalizeEmail(),
    check('password')
        .isLength({ min: 8 })
    , RLivraisonControllers.login)

route.get('/', RLivraisonControllers.getResponsableLivraison)

route.delete('/:id', RLivraisonControllers.deleteRL)

route.patch('/:id',
    check('name')
        .not()
        .isEmpty(),
    check('email')
        .normalizeEmail(),
    RLivraisonControllers.updateRL)

module.exports = route
