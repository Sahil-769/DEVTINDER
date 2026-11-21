const express = require('express')
const { connectDB } = require("./config/database");
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { validateSignUp } = require('./utils/validator');
const cookiesParser = require('cookie-parser');
app.use(express.json());
app.use(cookiesParser());
app.post("/signup", async (req, res) => {

    //Creating a new instance of the user model
    try {
        validateSignUp(req);
        // const user=new User(req.body);
        const { firstName, lastName, emailId, password, age,
            gender,
            occupation } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender,
            occupation
        });
        console.log(user);
        await user.save();
        res.send("User Added Successfully");
    }
    catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
}); 
app.post("/login",async (req,res)=>{
    try{
    const {emailId,password} = req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Email Id is not valid")
    }
    const user = await User.findOne({emailId:emailId});
    if(!user){
        throw new Error("Invalid Credentials")
    }
    const isPasswordValid =await bcrypt.compare(
        password,user.password
    )
    if(isPasswordValid){
        //Create a JWT Token
        const token = await jwt.sign({_id: user._id,},"SAHIL$769");
        console.log(token);
        res.cookie("token",token);
        res.send("Login Successfully!!!!!");
    }
    else{
        throw new Error("Invalid Credentials");
    }
    }
    catch(err){
        res.status(400).send("ERROR :" + err.message);

    }

});
app.get("/profile", async (req,res)=>{
    const cookies = req.cookies;
    const {token} = cookies;
    const decodedToken = await jwt.verify(token,"SAHIL$769");
    console.log(decodedToken);
    console.log(cookies);
    const {_id} = decodedToken;
    const user = await User.findById(_id);
    res.send(user);
})
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: userEmail });
        if (user.length === 0) {
            res.status(404).send("User not found");
        }
        else {
            res.send(user);
        }
    }
    catch (err) {
        res.status(400).send("Somthing went wrong", err.message);

    }
});
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})
app.delete("/user", async (req, res) => {
    const userid = req.body.id;
    try {
        const user = await User.findByIdAndDelete({ _id: userid });
        res.send("User Deleted Successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong", err.message);
    }
    // const userEmail=req.body.emailId;
    // const user=await User.findOne({emailId:userEmail});
    //     if(user.length === 0 ){
    //         res.status(404).send("User not found");
    //     }
    //     else{
    //         res.send(user);
    //     }

})
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    console.log(data);
    try {
        const ALLOWED_UPDATES = [
            "password",
            "age",
            "gender",
            "occupation"
        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        await User.findOneAndUpdate(
            { _id: userId },
            data,
            { runValidators: true }
        );
        res.send("User updated successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
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
