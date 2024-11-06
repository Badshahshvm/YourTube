const mongoose = require("mongoose")

const videoSchema = mongoose.Schema({
              _id: mongoose.Schema.Types.ObjectId,
              title:
              {
                            type: String,
                            required: true
              },
              description:
              {
                            type: String,
                            required: true

              },
              user_id:
              {
                            type: String,
                            required: true
              },
              videoUrl:
              {
                            type: String,
                            required: true
              },
              videoId:
              {
                            type: String,
                            required: true
              },
              thumbnailUrl:
              {
                            type: String, required: true
              },
              thumbnailId:
              {
                            type: String,
                            required: true
              },
              category:
              {
                            type: String,
                            required: true
              },
              tags:
                            [{
                                          type: String,

                            }],
              likes: {
                            type: Number,
                            default: 0
              },
              dislike:
              {
                            type: Number,
                            default: 0
              },
              likedBy: [{
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User'

              }],
              dislikedBy: [{
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User'

              }],
              views:
              {
                            type: Number, default: 0
              }
              // viewdBy: [
              //               {
              //                             type: mongoose.Schema.Types.ObjectId,
              //                             ref: "User"
              //               }
              // ]


},
              {
                            timestamps: true
              })

const videoModel = mongoose.model("Video", videoSchema);
module.exports = videoModel