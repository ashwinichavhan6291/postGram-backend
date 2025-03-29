const validator=require("validator");

const validateSignup=(req)=>{
    const{firstName,lastName,emailId,password}=req.body;

    if(!firstName|| !lastName){
        throw new Error("please enter the name");
    }
    else if(!emailId){
        throw new Error("please enter the EmailId");
    }
    else if(!password){
        throw new Error("please enter the password");
    }
    
}

const validateEditProfileData = (req) => {
    
    const allowedUpdate=["firstName","lastName","gender","age","skills","about"];

    const isEditUpdate=Object.keys(req.body).every((k)=>allowedUpdate.includes(k));
    return isEditUpdate;
  };
  
  const forgetPassword=(req)=>{
    const password=req.body.password;
    if(password && validator.isStrongPassword(password)){
        return true;
    }
  }
    
module.exports={validateSignup,validateEditProfileData,forgetPassword};