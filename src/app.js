const express = require('express')
const {connectDB}=require("./config/database");
const app = express();
const User = require('./models/user');

app.post("/signup",async (req,res)=>{
    //Creating a new instance of the user model
    const user=new User({
        firstName:"Saniya",
        lastName:"SahilAlvi",
        emailId:"saniyasahilalvi@gmail.com",
        password:"saniyasahilalvi@123",
        _id: "123456789101112131415161",
    });
    try{
        await user.save();
        res.send("User Added Successfully");
    }
    catch(err){
        res.status(400).send("Erroe saving the user:",err.message);
    }
    

    
})
connectDB().then(() => {
    console.log("Database connected established...");
    app.listen(3000, () => {
        console.log("Server is running")
    })
}).catch((err) => {
    console.error("Database cannot be connected!!", err);
});
