const express = require('express');
const Router = express.Router();
const controllers = require('../Controllers/Controller');

Router.get('/timeline', controllers.Timehandler);
Router.post('/new-post', controllers.Posthandler);
Router.get('/delete/post/:id', controllers.Deletehandler);
Router.get('/update/post/:id', controllers.Updatehandler);
Router.post('/edit-post/:id', controllers.editedPosthandler);
Router.post('/new-comment/:postId', controllers.Commenthandler); 
Router.get('/delete/comment/:commentId/:postId', controllers.DeleteComhandler);
module.exports = Router;