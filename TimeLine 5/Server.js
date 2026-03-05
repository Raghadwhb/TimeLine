const express = require('express');
const app = express();

const routes = require('./Config/Routes');
const cookieParser = require('cookie-parser');

require('./Config/mondb');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});