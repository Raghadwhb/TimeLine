const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {
        type: String,
        required: [true, "Comment body is required"],
        minlength: [25, "Comment should be minimum 25 characters"]
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
     user: {
        type: Schema.Types.ObjectId, ref: 'User' },
        
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);

