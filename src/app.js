const express = require('express')
const {connectDB}=require("./config/database");
const app = express();
const User = require('./models/user');
app.use(express.json());
app.post("/signup",async (req,res)=>{
    console.log(req.body);
    //Creating a new instance of the user model
    const user=new User(req.body);
    try{
        await user.save();
        res.send("User Added Successfully");
    }
    catch(err){
        res.status(400).send("Erroe saving the user: "+err.message);
    }
})
app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const user=await User.findOne({emailId:userEmail});
        if(user.length === 0 ){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("Somthing went wrong",err.message);

    }
})
app.get("/feed",async (req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})
app.delete("/user",async (req,res)=>{
    const userid=req.body.id;
    try{
        const user=await User.findByIdAndDelete({_id:userid});
        res.send("User Deleted Successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong",err.message);
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
app.patch("/user/:userId",async (req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    console.log(data);
    try{
        const ALLOWED_UPDATES=[
            "password",
            "age",
            "gender",
            "occupation"
        ];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        await User.findOneAndUpdate(
            {_id:userId},
            data,
            {runValidators:true}
        );
        res.send("User updated successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong "+err.message);
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
