const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../Utils/validation");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

//Sign Up.
authRouter.post("/signup", async(req,res)=>{
    try{
    //validation of data
    validateSignUpData(req);

    const {firstName, lastName, emailId, password} = req.body;
    
    //Encrypt the password.
    const passwordHash = await bcrypt.hash(password,10);
    // console.log(passwordHash);
    
    //creating a new instance of the user model.
    const userInstance = new User({firstName,lastName,emailId,password:passwordHash});
        
    const userSaved = await userInstance.save();
    
    const token = await userSaved.getJWT();
    //Add the token to cookie and send the response back to the user.
    res.cookie("token",token,{ 
        expires: new Date(Date.now() + 900000)
    }); 
    
    res.json({
        message: "User added successfully...",
        data: userSaved
    });
    
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
   
});

//Login API.
authRouter.post("/login",async(req,res)=>{
    try{
        const{emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId});
        
        if(!user){
            throw new Error("Invalid credentials..");
        }
        
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            //create a JWT Token.
            const token = await user.getJWT();
            //Add the token to cookie and send the response back to the user.
            res.cookie("token",token,{ 
                expires: new Date(Date.now() + 900000)
            }); 
            
            res.json({
                message: "User loggedIn successfully...",
                data: user
            });
            // res.send(user);
        }else{
            throw new Error("Invalid credentials.");
        }

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

//Logout API - To logout just expires the cookies and set the token to the null.
authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });

    res.status(200).send("Logout Successfully.");

});

module.exports = {authRouter};