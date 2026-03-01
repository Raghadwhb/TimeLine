const express = require('express');
const app = express();
const routes = require('./Config/Routes');  
const apiRoutes = require('./Config/ApiRoutes');
const usermodels = require('./Model/User'); 
require('./Config/mondb'); 

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(apiRoutes);
app.use(routes);


usermodels.findOne({ name: "Client" })
.then((user) => {
    if (!user) {
        console.log("Creating default user 'Client'...");
        return usermodels.create({ name: "Client" });
    }
})
.then(() => {
    
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
})
.catch((err) => {
    console.error("Error initializing default user:", err);
}); 