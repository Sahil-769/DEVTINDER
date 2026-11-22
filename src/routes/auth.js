const express = require('express');
const authRouter = express.Router();
const validator = require('validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignUp } = require('../utils/validator');
const {userAuth} = require('../middlewares/auth')
authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUp(req);
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

authRouter.post("/login", async (req, res) => {
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
        res.cookie("token", token, {
            expires: new Date(Date.now() + 168 * 3600000),
        });
        res.send("Login Successfully!!!!!!!!");
    }
});
authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("Logout Successfully!!!!!");
})

module.exports = authRouter;