const express = require('express');
const rout = express.Router();
const controller = require('../Controllers/APIController');

// Post API
rout.get('/api/get-posts', controller.getAllPosts);
rout.post('/api/create-post', controller.postOnePost);
rout.put('/api/edit-post/:id', controller.updateOnePost);
rout.delete('/api/delete-post/:id', controller.deletePost);

// Comment API
rout.get('/api/get-post-comments/:id_post', controller.getAllCommentsPost);
rout.post('/api/post-post-comment/:id_post', controller.postOneComment);

module.exports = rout;