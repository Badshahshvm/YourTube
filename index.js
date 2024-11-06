// const express = require("express");
// const mongoose = require("mongoose")
// require("dotenv").config();
// const fileUpload = require("express-fileupload")
// const video = require("./routes/video")
// const user = require("./routes/user");
// const comment = require("./routes/comment")
// const bodyParser = require("body-parser");
// const app = express()
// app.use(express.json())
// mongoose.connect(process.env.uri).then(() => console.log("db is connected")).catch((err) => console.log(err))
// app.use(bodyParser.json())
// app.use(fileUpload({
//               useTempFiles: true,
//               // tempFileDir: '/tmp/'
// }))
// app.use("/comment", comment)
// app.use("/video", video)
// app.use("/api/user", user)
// app.listen(process.env.PORT, () => {
//               console.log("server is runnig")
// })