const express = require("express");
const { addComment, getComment, editComment, deleteComment } = require("../controller/comment");
const router = express.Router()
const cgeckAuth = require("../middleware/cgeckAuth");
router.post("/new-comment/:videoId", cgeckAuth, addComment)
router.get("/:videoId", getComment)
router.put("/edit/:commentId", cgeckAuth, editComment)
router.delete("/delete/:commentId", cgeckAuth, deleteComment)
module.exports = router