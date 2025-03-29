const express = require("express");
const postRouter = express.Router();
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");

const postModel = require("../models/post");
const UserModel = require("../models/user");

postRouter.post("/post", userAuth, async (req, res) => {
  try {
    const { postTitle, postImage, postContent } = req.body;
    const userId = req.user._id;

    if (!validator.isURL(postImage)) {
      throw new Error("post Image is not Valid");
    }

    const posts = await new postModel({
      postTitle,
      postImage,
      postContent,
      createdBy: userId,
    });

    await posts.save();
    res.send(posts);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

postRouter.get("/getPost", userAuth, async (req, res) => {
  try {
    const createdBy = req.user._id;

    const posts = await postModel.find({ createdBy: createdBy });

    res.send(posts);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

postRouter.delete("/deletePost/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletePost = await postModel.findOneAndDelete({ _id: id });
    if (!deletePost) {
      return res.status(404).send("post not found");
    }

    res.json({ message: " post deleted successfully!! " });
  } catch (err) {
    return res.status(500).json("ERROR : " + err.message);
  }
});

postRouter.get("/postfeed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit ||50);
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;
    const postFeed = await postModel
      .find({ createdBy: { $ne: loggedInUser._id } })
      .populate("createdBy", "firstName lastName")
      .limit(limit)
      .skip(skip);
    res.send(postFeed);
  } catch (err) {
    console.log("ERROR ", err);
  }
});

postRouter.post("/post/:id/like", userAuth, async (req, res) => {
  try {
    const loggedInUser=req.user._id.toString();
    const postId=req.params.id;

    const post=await postModel.findById(postId);
    if(!post){
      throw new Error("post is not found");
    }
    if(post.likedBy.includes(loggedInUser)){
      throw new Error("you already liked this post");
    }

    if(post.dislikedBy.includes(loggedInUser)){
    post.dislikedBy=post.dislikedBy.filter((id)=>
       id.toString()!==loggedInUser);
    post.dislikes-=1
    }

   
    post.likes+=1;
    post.likedBy.push(loggedInUser);

    await post.save();
    res.json({message : "you have successfully liked this post" ,
     likes : post.likes,
     dislikes :post.dislikes,
     likedBy:post.likedBy,
     dislikedBy:post.dislikedBy
    })
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});


postRouter.post("/post/:id/dislike", userAuth, async (req, res) => {
  try {
    const loggedInUser=req.user._id.toString();
    const postId=req.params.id;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   
     if (post.dislikedBy.includes(loggedInUser)) {
      throw new Error("you have already disliked this post");
    }

if(post.likedBy.includes(loggedInUser)){
   post.likedBy=post.likedBy.filter((id)=> id.toString()!==loggedInUser);
   post.likes-=1;
}
post.dislikes+=1;
post.dislikedBy.push(loggedInUser);

    await post.save(); 
    res.json({ message: "Post disliked successfully",
       likes: post.likes,
       dislikes: post.dislikes,
      likedBy : post.likedBy,
    dislikedBy:post.dislikedBy
  });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = postRouter;
