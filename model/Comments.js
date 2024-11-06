const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
              _id: mongoose.Schema.Types.ObjectId,
              videoId: {
                            type: String,
                            required: true
              },
              commentText: {
                            type: String,
                            required: true
              },
              user_id: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User",
                            required: true
              }
}, {
              timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
