const express = require('express')
const { connectDB } = require("./config/database");
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { validateSignUp } = require('./utils/validator');
const cookiesParser = require('cookie-parser');
const { userAuth } = require("./middlewares/auth");
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
        await user.save();
        res.send("User Added Successfully");
    }
    catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
        throw new Error("Please Enter valid Email");
    }
    const user = await User.findOne({ emailId: email });
    if (!user) {
        throw new Error("Invalid Credential");
    }
    const isPasswordValid = await user.checkPassword(password);
    if (isPasswordValid) { 
        const token = await user.getJWT();
        res.cookie("token", token,{
            expires:new Date(Date.now() + 168 * 3600000),
        });
        res.send("Login Successfully!!!!!!!!");
    }
});
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});
app.post("/send-request",userAuth,async (req,res)=>{
    const user = req.user;
    //Sending a connection request
    console.log("Sending a connection request");
    res.send(user.firstName+" send the connect request!!");

});
connectDB().then(() => {
    console.log("Database connected established...");
    app.listen(3000, () => {
        console.log("Server is running")
    })
}).catch((err) => {
    console.error("Database cannot be connected!!", err);
});
