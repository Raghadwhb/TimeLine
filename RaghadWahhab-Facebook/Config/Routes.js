const express = require('express');
const Router = express.Router();

const controllers = require('../Controllers/Controller');

Router.get('/feed', controllers.homehandler);

Router.post('/feed/add', controllers.addPostHandler);

Router.get('/feed/:id', controllers.detailedFeedHandler);

Router.get('/feed/edit/:id', controllers.editFeedHandler);

Router.post('/feed/update/:id', controllers.updateFeedHandler);

Router.get('/feed/delete/:id', controllers.deleteFeedHandler);

module.exports = Router;