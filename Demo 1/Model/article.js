const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({

    title:{
        type:String,
        required:[true,"Title is required"],
        minlength:[25,"Title must be at least 25 characters"]
    },

    article:{
        type:String,
        required:[true,"Article is required"],
        minlength:[100,"Article must be at least 100 characters"]
    }

},{
    timestamps:true
});

module.exports = mongoose.model('Article',articleSchema);