const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { forgetPassword } = require("../utils/validation");

const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const postModel = require("../models/post");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData) {
      throw new Error("invalid edit request");
    }

    const loggedinUser = req.user;

    Object.keys(req.body).forEach((k) => (loggedinUser[k] = req.body[k]));

    await loggedinUser.save();
    res.json({
      message: `${loggedinUser.firstName} your profile is updated successfully`,
      data: loggedinUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.post("/profile/password", async (req, res) => {
  try {
    if (!forgetPassword(req)) {
      throw new Error("invalid password request");
    }

    const user = await UserModel.findOne({ emailId: req.body.emailId });

    if (!user) {
      throw new Error("email id is not valid");
    }

    const updatedPassword = req.body.password;
  
    const newPassword = await bcrypt.hash(updatedPassword, 10);

    user.password = newPassword;

    await user.save();
    res.send(` ${user.firstName} your password is updated successfully`);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.get("/profile/:userId",userAuth,async(req,res)=>{
  try{
    const user=await UserModel.findById(req.params.userId);
    res.send(user);
  }
  catch(err){
    return res.status(400).json({message : err.message})
  }
})
module.exports = profileRouter;
