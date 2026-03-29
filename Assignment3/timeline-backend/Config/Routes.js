const express = require('express');
const Router = express.Router();

const controllers = require('../Controllers/Controller');
const usercontroller = require('../Controllers/usercontroller');
const userauth = require('../auth/auth');

// Timeline
Router.get('/timeline', userauth.isloggedin, controllers.getTimeline);

// Posts - proper HTTP methods
Router.post('/new-post', userauth.requireAuth, controllers.addPost);
Router.delete('/delete/post/:id', userauth.requireAuth, controllers.deletePost);
Router.put('/edit-post/:id', userauth.requireAuth, controllers.editPost);

// Comments - proper HTTP methods
Router.post('/new-comment/:postId', userauth.requireAuth, controllers.addComment);
Router.delete('/delete/comment/:commentId/:postId', userauth.requireAuth, controllers.deleteComment);

// Users
Router.post('/user/signup', usercontroller.signup);
Router.post('/user/login', usercontroller.login);
Router.get('/user/logout', usercontroller.logout);

module.exports = Router;
