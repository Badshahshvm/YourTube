const express = require("express");
const { upload, update, deleteVideo, likeVideo, disLikeVideo, viewVideos } = require("../controller/video");
const cgeckAuth = require("../middleware/cgeckAuth");
const router = express.Router();

router.post("/upload", cgeckAuth, upload)

router.put("/:videoId", cgeckAuth, update)
router.delete("/:videoId", cgeckAuth, deleteVideo)
router.put("/like/:videoId", cgeckAuth, likeVideo)
router.put("/dislike/:videoId", cgeckAuth, disLikeVideo)
router.put("/views/:videoId", viewVideos)
module.exports = router