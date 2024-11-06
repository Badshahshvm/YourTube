const User = require("../model/User");
const brcypt = require("bcrypt")
require("dotenv").config();
const jwt = require("jsonwebtoken")
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose")
console.log(process.env.API_SECRET)
cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
});

const signup = async (req, res) => {

      try {
            const users = await User.find({ email: req.body.email });
            if (users.length > 0) {
                  res.json({
                        success: false,
                        message: "User already registered"
                  })
            }

            const hashPassword = await brcypt.hash(req.body.password, 10);

            const uploadedImage = await cloudinary.uploader.upload(req.files.logo.tempFilePath)
            console.log(uploadedImage, hashPassword)

            const user = new User({
                  _id: new mongoose.Types.ObjectId,
                  channelName: req.body.channelName,
                  email: req.body.email,
                  phone: req.body.phone,
                  password: hashPassword,
                  logoUrl: uploadedImage.secure_url,
                  logoId: uploadedImage.public_id


            })
            await user.save();
            res.json({
                  success: true,
                  message: "signup successfully",
                  user: user
            })
      }
      catch (err) {
            console.log(err)
            res.json({
                  success: false,
                  message: err.message
            })

      }
}
const login = async (req, res) => {
      try {
            console.log(req.body);
            const users = await User.find({ email: req.body.email });

            if (users.length === 0) {
                  return res.json({
                        success: false,
                        message: "User not found"
                  });
            }

            const isPassword = await brcypt.compare(req.body.password, users[0].password);

            if (!isPassword) {
                  return res.json({
                        success: false,
                        message: "Invalid password"
                  });
            }

            const token = jwt.sign({
                  _id: users[0]._id,
                  channelName: users[0].channelName,
                  email: users[0].email,
                  phone: users[0].phone,
                  logoId: users[0].logoId,
                  logoUrl: users[0].logoUrl
            }, 'shivam 123', { expiresIn: '365d' });

            res.json({
                  success: true,
                  message: "Successfully logged in",
                  user: users[0],
                  token: token
            });
      } catch (err) {
            res.json({
                  success: false,
                  message: err.message
            });
      }
};

const subscribeChannel = async (req, res) => {
      try {
            const token = req.headers.authorization.split(" ")[1];
            const userA = jwt.verify(token, 'shivam 123');
            const userB = await User.findById(req.params.userBId);

            if (!userB) {
                  return res.json({
                        success: false,
                        message: "Channel not found"
                  });
            }

            if (userB.subscribedBy.includes(userA._id)) {
                  return res.json({
                        success: false,
                        message: "You have already subscribed"
                  });
            }

            const userAFullInformation = await User.findById(userA._id);

            if (!userAFullInformation) {
                  return res.json({
                        success: false,
                        message: "User not found"
                  });
            }

            // Update subscriptions
            userB.subscribers += 1;
            userB.subscribedBy.push(userA._id);
            await userB.save();

            // Avoid duplicating channels in the subscribed list
            if (!userAFullInformation.subscribedChannels.includes(userB._id)) {
                  userAFullInformation.subscribedChannels.push(userB._id);
            }
            await userAFullInformation.save();

            res.json({
                  success: true,
                  message: "Channel subscribed",
                  userA: userAFullInformation,
                  userB: userB
            });
      } catch (err) {
            res.json({
                  success: false,
                  message: err.message
            });
      }
};

const unsubscribedChannel = async (req, res) => {
      try {
            const token = req.headers.authorization.split(" ")[1];
            const userA = jwt.verify(token, 'shivam 123');  // No need to use await for jwt.verify
            const userB = await User.findById(req.params.userBId);
            const userAFullInformation = await User.findById(userA._id);
            if (!userB) {
                  return res.json({
                        success: false,
                        message: "Channel not found"
                  });
            }

            if (userB.subscribedBy.includes(userA._id)) {
                  // Update userB's subscriber count and list
                  userB.subscribers -= 1;
                  userB.subscribedBy = userB.subscribedBy.filter(userId => userId.toString() !== userA._id);
                  await userB.save();

                  // Update userA's subscribed channels list

                  userAFullInformation.subscribedChannels = userAFullInformation.subscribedChannels.filter(userId => userId.toString() != userB._id);
                  await userAFullInformation.save();
            }





            res.json({
                  success: true,
                  message: "Unsubscribed",
                  userA: userAFullInformation,
                  userB: userB
            });
      } catch (err) {
            res.json({
                  success: false,
                  message: err.message
            });
      }
};



module.exports = { signup, login, subscribeChannel, unsubscribedChannel }