const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const senderExist = await User.findById(fromUserId);
        const recieverExist = await User.findById(toUserId);

        if (!senderExist) {
            throw new Error("Sender Does not exist");
        }
        if (!recieverExist) {
            throw new Error("Reciver Does not Exist");
        }
        const status = req.params.status;
        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid Status");
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);
        if (existingConnectionRequest) {
            throw new Error("Request has been already sent");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUserId.firstName,
            data,
        })
    }
    catch (err) {
        res.status(404).json({ message: `ERROR: ${err.message}` });
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allowedStatus = ["accepted", "rejected"];
        const { status, requestId } = req.params;
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status");
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if (!connectionRequest) { throw new Error("Request Not Found"); }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: `Request Successfully ${status}`, data });
    }
    catch (err) {
        res.status(404).json({ message: `${err}` });
    }
})

module.exports = requestRouter;