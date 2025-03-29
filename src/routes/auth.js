const validator = require("validator");
const UserModel = require("../models/user");
const {validateSignup} = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const express = require("express");
const authRouter = express.Router();
authRouter.use(cookieParser());

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, password, emailId } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await new UserModel({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
    });

    if (!validator.isStrongPassword(password)) {
      throw new Error("password isnot correct");
    }
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await UserModel.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly:true,
        secure:true,
        sameSite:"none",
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.json({message : "user loggedIn successfully" , data : {user}});
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    }).send("logout successfully")
})
module.exports = authRouter;
