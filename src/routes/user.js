const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName";
//Get all the pending connecion request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName"]);
        res.send(connectionRequest)
    }
    catch (err) {
        res.status(404).send("ERROR: " + err.message);
    }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedUser._id, status: "accepted" },
                { fromUserId: loggedUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() == loggedUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ data });
    }
    catch (err) {
        res.status(404).send("ERROR: " + err.message);
    }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user;
        
        //exclude those users whom which i had interacted.
        // For Status: Accept,Interested,Rejected,Ignore(loogedUser->ignore someone) -> Don't Show.
        // For Status: Ignore(by another user) -> but still you will be able to see profile of other user.
        

        const feedUser = await User.find({});
        res.json({ message: `Hello ${loggedUser.firstName}, Welcome in the FEED`, data: feedUser });
    }
    catch (err) {
        res.status(404).json({ message: err });
    }
});

module.exports = userRouter;