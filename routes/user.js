const express = require('express');
const route = express.Router();

const userControllers = require('../controllers/user')

const {check} = require('express-validator')

route.post('/signup', 
check('name')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, userControllers.signup)

route.post('/login', 

check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, userControllers.login)

route.get('/',userControllers.getUser)
route.get('/:id',userControllers.getUserById)
route.delete('/:id',userControllers.deleteuser)

route.patch('/:userid',
check('name')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, userControllers.updateUser)

route.patch('/block/:id',userControllers.blockUser)
route.patch('/unblock/:id',userControllers.unblockUser)



module.exports = route