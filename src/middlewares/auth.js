const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
        const decode = await jwt.verify(token,"SAHIL@769");
        const {_id}=decode;
        const user=await User.findById({_id});
        if(!user){
            throw new Error("User Not Find");
        }
        req.user=user;
        next();
    }catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
}

module.exports = {
    userAuth,
}