const express = require('express')
const Router = express.Router()
const controller = require('../Controllers/Controller')

Router.get('/',controller.authPage)

Router.post('/register',controller.registerUser)

Router.post('/login',controller.loginUser)

Router.get('/profile',controller.profilePage)

Router.get('/logout',controller.logoutUser)

module.exports = Router