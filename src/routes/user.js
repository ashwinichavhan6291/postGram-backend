const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionModel = require("../models/connectionRequest");
const UserModel = require("../models/user");


const User_Safe_Data = "firstName lastName photourl age skills gender about";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connection = await ConnectionModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", User_Safe_Data);

    
    res.json({
      message: "connection Requests is fetching successfully",
      data: connection,
    });
  } catch (err) {
    return res.status(400).send("Error" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    loggedInUser = req.user;
   

    const connections = await ConnectionModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", User_Safe_Data).populate("toUserId", User_Safe_Data)
    const data = connections.map((row) => {
      return row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId;
    });
    
      
  
    res.json({ data });
  } catch (err) {
    res.json("ERROR" + err.message);
  }
});
// skip=(page-1)*limit

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page=parseInt(req.query.page)|| 1;
    let limit=parseInt(req.query.limit)|| 10;
    limit=limit>50 ? 50 : limit;
    const skip=(page-1)*limit;

    
    const connectionRequest = await ConnectionModel.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId"); 
    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

  
    const users = await UserModel.find({ $and:[
     { _id: { $nin: Array.from(hideUsersFromFeed) }},
  {_id:{$ne : loggedInUser._id}}
    ]
  }).select(User_Safe_Data)
  .skip(skip)
  .limit(limit);

    res.status(200).json({data : users});
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = userRouter;
