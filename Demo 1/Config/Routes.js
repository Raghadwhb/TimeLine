const express = require('express');
const Router = express.Router();
const controllers = require('../Controllers/Controller');

Router.get('/homepage', controllers.homehandler);

Router.get('/add/new-Article', controllers.addNewArticle);
Router.post('/submit-article', controllers.submitArticle);

Router.get('/view/article/:id', controllers.viewArticle);

Router.get('/delete/article/:id', controllers.deleteArticle);

Router.get('/edit/article/:id', controllers.editArticle);
Router.post('/submit-edited-article/:id', controllers.updateArticle);

module.exports = Router;