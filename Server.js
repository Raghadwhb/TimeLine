const express= require('express');
const app= express();
const routes= require('./Config/Routes');   
app.listen(3000,()=>{ console.log("Server is running on port 3000")});
app.set('view engine', 'ejs');
app.use(routes);
app.use(express.static('public'));