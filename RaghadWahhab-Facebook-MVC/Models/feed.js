const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FeedSchema = new Schema({

    Name:{
        type:String,
        required:[true,"Name is required"],
        maxlength:[15,"Name must be at most 15 characters"]
    },

    Message:{
        type:String,
        required:[true,"Message is required"],
        maxlength:[40,"Message must be at most 40 characters"]
    }

},{
    timestamps:true
});

module.exports = mongoose.model("FEED",FeedSchema);