const express = require('express');
const authRouter = express.Router();
const validator = require('validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignUp } = require('../utils/validator');
const { userAuth } = require('../middlewares/auth');

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
    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Please Enter valid Email");
        }

        const user = await User.findOne({ emailId: emailId.toLowerCase() });
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
        else {
            res.send("Invalid Credential");
        }
    }
    catch (err) {
        res.status(404).send("ERROR: " + err.message);
    }
});
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("Logout Successfully!!!!!");
});
authRouter.post("/password/forgot", userAuth, async (req, res) => {
    try {
        const loggeduser = req.user;
        const { email, newPassword } = req.body;
        if (!validator.isStrongPassword(newPassword) && !validator.isEmail(email)) {
            throw new Error("Please Enter a Strong Password or Valid email");
        }
        if (loggeduser["emailId"] !== email) {
            throw new Error("Invalid Credential");
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);
        loggeduser.password = hashNewPassword;
        console.log(loggeduser["password"]);

        await loggeduser.save();
        res.send(`Congratulations!!! ${loggeduser.firstName}, your password is successfully updated `);
    }
    catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }

});
authRouter.post("/password/change", userAuth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const loggeduser = req.user;
    const isPasswordValid = await loggeduser.checkPassword(oldPassword);
    if (isPasswordValid) {
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("Please Enter a Strong new Password");
        }
        const newPassHash = await bcrypt.hash(newPassword, 10);
        loggeduser.password = newPassHash;
        await loggeduser.save();
        res.send(`Congratulations!!! ${loggeduser.firstName}, your password is successfully changed`);
    }
    else {
        throw new Error("Please Enter Correct Password");
    }
});
module.exports = authRouter;