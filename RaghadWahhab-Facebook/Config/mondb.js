const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://raghadwahhabeng_db_user:Sham.1234@cluster0.3h7ejzw.mongodb.net/Facebook?retryWrites=true&w=majority')

.then(()=>{
    console.log("Connected to MongoDB");
})

.catch((err)=>{
    console.log("MongoDB connection error:", err);
});