const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const postSchema = new Schema({
  post: {
    type: String,
    required: [true, "Post is required"],
    minlength: [25, "Post should be minimum 25 character"]
  },
  user: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  comments: [
    {type: Schema.Types.ObjectId, ref: "Comment"}
  ]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);