const express= require('express');
const rout= express.Router();
const controllers= require('../Controllers/Controller');
rout.get('/timeline', controllers.Timehandler);
module.exports= rout;