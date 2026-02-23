const express= require('express');
const rout= express.Router();
const controllers= require('../Controllers/Controller');

rout.get('/timeline', controllers.Timehandler);
rout.post('/new-post', controllers.Posthandler);
rout.get('/delete/post/:id', controllers.Deletehandler);
rout.get('/update/post/:id', controllers.Updatehandler);
rout.post('/edit-post/:id', controllers.editedPosthandler);
module.exports= rout;