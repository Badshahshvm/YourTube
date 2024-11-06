const express = require("express");
const cgeckAuth = require("../middleware/cgeckAuth");
const { signup, login, subscribeChannel, unsubscribedChannel } = require("../controller/user");
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.put("/subscribe/:userBId", cgeckAuth, subscribeChannel)
router.put("/unsubscribe/:userBId", cgeckAuth, unsubscribedChannel)
module.exports = router