
require('dotenv').config(); 
const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));
};

module.exports = connectDB;