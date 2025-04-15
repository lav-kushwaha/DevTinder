const express = require("express");
const { userAuth } = require("../middleware/auth");
const {validateEditProfileData} = require("../Utils/validation");
const profileRouter = express.Router();

//get profile view.
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
    //req.user - user data we are getting from userAuth.
    const user = req.user;
    if(!user){
        throw new Error("Please login again");
    }
    res.send(user);
    }catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
});

//profile edit
profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
    try{

        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!!");
        }

        //This data coming from userAuth.
        const loggedInUser = req.user;
        // console.log(loggedInUser);
    
        // loggedInUser.firstName = req.body.firstName;
        // loggedInUser.lastName = req.body.lastName;

        //update loggedInUser to req.body data.
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
        // console.log(loggedInUser);

        //save data into database.
        await loggedInUser.save();

        res.json({
            message :loggedInUser.firstName + " Your profile updated successfully!",
            data : loggedInUser
        });

    }catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
});

module.exports = {profileRouter};