const express = require('express');
const Router = express.Router();

const controllers = require('../Controllers/Controller');
const usercontroler = require('../Controllers/usercontroller');
const userauth = require('../auth/auth');

Router.get('/timeline', userauth.isloggedin, controllers.Timehandler);

Router.post('/new-post', userauth.requireAuth, controllers.Posthandler);
Router.post('/new-comment/:postId', userauth.requireAuth, controllers.Commenthandler);

Router.get('/delete/post/:id', userauth.requireAuth, controllers.Deletehandler);
Router.get('/update/post/:id', userauth.requireAuth, controllers.Updatehandler);
Router.post('/edit-post/:id', userauth.requireAuth, controllers.editedPosthandler);
Router.get('/delete/comment/:commentId/:postId', userauth.requireAuth, controllers.DeleteComhandler);

Router.get('/user/signup-login', userauth.issignuploginenabled, usercontroler.rendersignuppage);
Router.post('/user/signup-login', usercontroler.signup);
Router.post('/user/login', usercontroler.login);
Router.get('/user/logout', usercontroler.logout);

module.exports = Router;