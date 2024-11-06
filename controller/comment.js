const mongoose = require("mongoose")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const Video = require("../model/Video")
const Comment = require("../model/Comments")

//create comment
const addComment = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = jwt.verify(token, 'shivam 123');

                            const comment = new Comment({
                                          _id: new mongoose.Types.ObjectId,
                                          videoId: req.params.videoId,
                                          user_id: user._id,
                                          commentText: req.body.commentText
                            })
                            await comment.save();
                            res.json({
                                          success: true,
                                          message: "comment is done",
                                          comment: comment
                            })

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }

}


//edit commnent
const editComment = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = jwt.verify(token, 'shivam 123');
                            const comment = await Comment.findById(req.params.commentId)
                            console.log(comment)
                            if (comment.user_id != user._id) {
                                          return res.json({
                                                        success: false,
                                                        message: "Invalid Credintials"

                                          })
                            }
                            comment.commentText = req.body.commentText
                            await comment.save()
                            res.json({
                                          success: true,
                                          comment: comment
                            })

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }

}
//delete comment
const deleteComment = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = jwt.verify(token, 'shivam 123');
                            const comment = await Comment.findById(req.params.commentId)
                            if (comment.user_id != user._id) {
                                          return res.json({
                                                        success: false,
                                                        message: "Invalid Credintials"

                                          })
                            }
                            await Comment.findByIdAndDelete(req.params.videoId);
                            res.json({
                                          success: true,
                                          message: "deleted successfully"
                            })

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }

}

// read comments
const getComment = async (req, res) => {
              try {
                            const allComments = await Comment.find({ videoId: req.params.videoId }).populate("user_id", "channelName logoUrl")

                            res.json({
                                          success: true,
                                          message: "all comments are",
                                          comments: allComments
                            })

              }
              catch (err) {
                            res.json({
                                          success: true,
                                          message: err.message
                            })
              }

}

module.exports = { addComment, editComment, deleteComment, getComment }