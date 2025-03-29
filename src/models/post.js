const mongoose = require("mongoose");
const UserModel = require("./user");

const postSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel,
  },
  postTitle: {
    type: String,
  },
  postImage: {
    type: String,
    default:
      "https://images.pexels.com/photos/30810205/pexels-photo-30810205/free-photo-of-flock-of-birds-in-flight-against-clear-sky.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  },
  postContent: {
    type: String,
  },
  likes :{
    type:Number,
    default:0
  },
  dislikes :{
    type : Number,
    default:0
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  dislikedBy : [{type:mongoose.Schema.Types.ObjectId, ref:"user"}],
},

);

const postModel = mongoose.model("post", postSchema);
module.exports = postModel;
