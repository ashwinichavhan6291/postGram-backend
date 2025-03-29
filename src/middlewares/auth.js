const UserModel = require("../models/user");
const jwt=require("jsonwebtoken");

const userAuth=async(req,res,next)=>{
try{
    const{token}=req.cookies;
   
   
    if(!token){
 throw new Error("please Login first");
    }
    const decodedMessage=await jwt.verify(token,"node-practice");
    const {_id}=decodedMessage;

    const user=await UserModel.findById(_id);

    if(!user){
        throw new Error("user not found");
    }

req.user=await user;
next();
}
catch(err){
  return res.status(400).json({error : err.message});
}
    }
    module.exports={userAuth}