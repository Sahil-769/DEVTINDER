const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepeted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// here 1 means asscending order and -1 means decending order

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    //  Check if the fromuserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
    }
}); 

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequestModel;