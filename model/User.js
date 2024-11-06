const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
              _id:

                            mongoose.Schema.Types.ObjectId,
              channelName:
              {
                            type: String,
                            required: true
              },
              email: {
                            type: String, required: true,
                            unique: true
              },
              phone:
              {
                            type: String,
                            required: true
              }, password:
              {
                            type: String,
                            required: true
              },
              logoUrl:
              {
                            type: String,
                            required: true

              },
              logoId:
              {
                            type: String, required: true

              },
              subscribers:
              {
                            type: Number,
                            default: 0
              },
              subscribedBy: [
                            {
                                          type: mongoose.Schema.Types.ObjectId,
                                          ref: 'User'
                            }
              ],
              subscribedChannels:
                            [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]



}, {
              timestamps: true
})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel;