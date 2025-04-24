const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    //Read the token from the req cookies.
    try{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).send("please Login!"); //Unauthorized
    }

    //validate the token
    const decodedData = await jwt.verify(token,process.env.JWT_SECRET);
    const {_id} = decodedData;

    //find the user from database through id.
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    //pass user in req
    req.user = user;
    next();
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = {
    userAuth
};