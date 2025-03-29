const mongoose=require("mongoose");
const UserModel = require("./user");

const connectionSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:UserModel,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:UserModel,
        required:true

    },
    status: {
        type:String,
        required:true,
        enum : {
            values:["accepted","rejected","interested","ignored"],
            message :`{VALUE} is invalid status type` 
        }
    }
},
{timestamps:true});

connectionSchema.index({fromUserId:1,toUserId:1});

 connectionSchema.pre("save",function(next){
    const connectionSchema=this;

    if(connectionSchema.fromUserId.equals(connectionSchema.toUserId)){
        throw new Error("you cannot send connection Request to yourself");
    }
    next();

})
const ConnectionModel=mongoose.model("connectionRequest",connectionSchema);
module.exports=ConnectionModel;