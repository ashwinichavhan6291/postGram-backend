const mongoose=require("mongoose")
const validator=require("validator");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({

    firstName : {
        type :String,
        required:true,
       
        minLength:4,
        maxLength:10,
    },
    lastName : {
        type : String,
        minLength:4,
        maxLength:10,
    },
    emailId :{
        type:String,
        lowercase:true,
        required:true,
        unique: true,

      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("email is not valid");
        }
      }
    },
    password:{
        type:String,
        required:true,

       
    },
    age:{
        type:Number,
        min:18
    },
    gender :{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender is not valid")
                
            }
        }
    },
    photourl:{
        type:String,
        default : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-260nw-1913928688.jpg",

       
    },
    about:{
        type:String,
        default : "this is a default description of the user"
    },
    skills: {
     type :  [String]
    },

},
{timestamps:true} ,
)

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user.id},"node-practice",{expiresIn: "1d"});
    return token;
}


const UserModel=mongoose.model("user",userSchema);
module.exports=UserModel;