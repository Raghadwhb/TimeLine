const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://raghadwahhabeng_db_user:Sham.1234@cluster0.3h7ejzw.mongodb.net/timeline?appName=Cluster0')
.then(() => {
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.error('Could not connect to MongoDB', err)
});