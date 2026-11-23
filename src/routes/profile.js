const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validProfileEdit} = require("../utils/validator");
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validProfileEdit(req)){
            throw new Error("Permission Denied to edit this change");
        }
        const logedInUser = req.user;
        Object.keys(req.body).forEach((key) =>(logedInUser[key] = req.body[key]));
        await logedInUser.save();
        res.send("edit successfullly");
    }
    catch(err){
        res.status(401).send("ERROR: "+ err.message);
    }
    
})
module.exports = profileRouter;