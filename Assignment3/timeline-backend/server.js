const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routes = require('./Config/Routes');

const app = express();
const PORT = 5000;

// Connect MongoDB
mongoose.connect('mongodb+srv://raghadwahhabeng_db_user:Sham.1234@cluster0.3h7ejzw.mongodb.net/timeline?appName=Cluster0')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error', err));

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));