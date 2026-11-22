var validator = require('validator');
const validateSignUp = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not Valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not Strong");
    }
}
const validProfileEdit = (req)=>{
    const allowedFieldEdit = ["firstName","lastName","emailId","age","occupation"];
    const isEditAllowed = Object.keys(req.body).every((field)=>
    allowedFieldEdit.includes(field));
    return isEditAllowed;
}
module.exports={
    validateSignUp,
    validProfileEdit
}
