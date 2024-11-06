const jwt = require("jsonwebtoken")
const Video = require("../model/Video")
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose")

cloudinary.config({
              cloud_name: process.env.CLOUD_NAME,
              api_key: process.env.API_KEY,
              api_secret: process.env.API_SECRET
});
const upload = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1]
                            const user = await jwt.verify(token, 'shivam 123')
                            const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath);
                            const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
                                          resource_type: 'video'
                            });

                            const video = new Video({
                                          _id: new mongoose.Types.ObjectId,
                                          title: req.body.title,
                                          description: req.body.description,
                                          user_id: user._id,
                                          videoUrl: uploadedVideo.secure_url,
                                          thumbnailUrl: uploadedThumbnail.secure_url,
                                          videoId: uploadedVideo.public_id,
                                          thumbnailId: uploadedThumbnail.public_id,
                                          category: req.body.category,
                                          tags: req.body.tags.split(",")

                            })
                            await video.save()
                            res.json({
                                          success: true,
                                          message: "video is uploaded",
                                          video: video
                            })


              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }

}
const update = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const video = await Video.findById(req.params.videoId);

                            if (!video) {
                                          return res.json({
                                                        success: false,
                                                        message: "Video not found"
                                          });
                            }

                            if (video.user_id.toString() !== user._id) {
                                          return res.json({
                                                        success: false,
                                                        message: "You do not have permission to update this video"
                                          });
                            }

                            console.log("Permission granted: User can update");

                            let updatedData = {
                                          title: req.body.title,
                                          description: req.body.description,
                                          category: req.body.category,
                                          tags: req.body.tags ? req.body.tags.split(",") : []
                            };

                            if (req.files && req.files.thumbnail) {
                                          await cloudinary.uploader.destroy(video.thumbnailId);
                                          const updatedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath);
                                          updatedData.thumbnailUrl = updatedThumbnail.secure_url;
                                          updatedData.thumbnailId = updatedThumbnail.public_id;
                            }

                            const updatedVideo = await Video.findByIdAndUpdate(req.params.videoId, updatedData, { new: true });

                            res.json({
                                          success: true,
                                          message: "Video updated successfully",
                                          video: updatedVideo
                            });

              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
};
const deleteVideo = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const video = await Video.findById(req.params.videoId);
                            if (!video) {
                                          return res.json({
                                                        success: false,
                                                        message: "Video not found"
                                          });
                            }
                            if (video.user_id.toString() !== user._id) {
                                          return res.json({
                                                        success: false,
                                                        message: "You do not have permission to update this video"
                                          });
                            }

                            cloudinary.uploader.destroy(video.videoId,
                                          {
                                                        resource_type: 'video'
                                          }
                            )
                            cloudinary.uploader.destroy(video.thumbnailId)
                            const deleteVideo = await Video.findByIdAndDelete(req.params.videoId);
                            res.json({
                                          success: true,
                                          message: "delete sucessfully",
                                          video: deleteVideo

                            })

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}

const likeVideo = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const video = await Video.findById(req.params.videoId);

                            if (!video) {
                                          return res.json({
                                                        success: false,
                                                        message: "Video not found"
                                          });
                            }

                            if (video.likedBy.includes(user._id)) {
                                          return res.json({
                                                        success: false,
                                                        message: "Video already liked"
                                          });
                            }

                            if (video.dislikedBy.includes(user._id)) {
                                          video.dislike -= 1;
                                          video.dislikedBy = video.dislikedBy.filter(userId => userId.toString() !== user._id);
                            }

                            video.likes += 1;
                            video.likedBy.push(user._id);
                            await video.save();

                            res.json({
                                          success: true,
                                          message: "Video liked",
                                          video: video
                            });

              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
};

const disLikeVideo = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const user = await jwt.verify(token, 'shivam 123');
                            const video = await Video.findById(req.params.videoId);

                            if (!video) {
                                          return res.json({
                                                        success: false,
                                                        message: "Video not found"
                                          });
                            }

                            if (video.dislikedBy.includes(user._id)) {
                                          return res.json({
                                                        success: false,
                                                        message: "Video already disliked"
                                          });
                            }

                            if (video.likedBy.includes(user._id)) {
                                          video.likes -= 1;
                                          video.likedBy = video.likedBy.filter(userId => userId.toString() !== user._id);
                            }

                            video.dislike += 1;
                            video.dislikedBy.push(user._id);
                            await video.save();

                            res.json({
                                          success: true,
                                          message: "Video disliked",
                                          video: video
                            });

              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            });
              }
};


const viewVideos = async (req, res) => {
              try {
                            const video = await Video.findById(req.params.videoId)
                            console.log(video)
                            video.views += 1;
                            await video.save()
                            res.json({
                                          success: true,
                                          video: video
                            })
              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}
module.exports = { upload, update, deleteVideo, likeVideo, disLikeVideo, viewVideos }