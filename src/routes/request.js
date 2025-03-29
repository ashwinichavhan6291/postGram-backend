const express = require("express");
const requestRouter = express.Router();
const ConnectionModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    const fromUserId = req.user._id;
    const status = req.params.status;
    const toUserId = req.params.toUserId;
    try {
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("staus type is invalid : " + status);
      }
      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        throw new Error("User Id is not present");
      }
      const existingConnectionRequest = await ConnectionModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send("connection Request already exists");
      }
      const connectionRequest = await new ConnectionModel({
        fromUserId,
        status,
        toUserId,
      }).populate("toUserId", "firstName lastName skills about age photourl");
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).json({ message: "Connection request not found" });
      }

     
      const connectionRequest = await ConnectionModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
      return   res.json({ message: "Connection request not found" });
      }
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: `Connection request is ${status}`, data });
    } catch (err) {
      return res.json({ error: "ERROR: " + err.message });
    }
  }
);


module.exports = requestRouter;
