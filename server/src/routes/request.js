const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

//Interested and ignored to the touserId from fromUserId.
requestRouter.post("/request/send/:status/:toUserId",
    userAuth,
    async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //Status Validation.
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+ status});
        }
        
        //check if userid is present in db or not.
        //you can't send req to any userid.
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User not found"});
        }

        //existing connectionRequest validation.
        const existingConnectionRequest = await ConnectionRequest.findOne(
           {
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
               ],
           }
        );

        if(existingConnectionRequest){
            return res.status(400).send({message:"Connection Request Already Exists!!!"});
        }

        //Instance object of connection request.
         const connectionRequest = new ConnectionRequest({
            fromUserId,toUserId,status
         });

         //saved data into the data base.
         const data = await connectionRequest.save();

         res.json({
            message: req.user.firstName + " is "+ status + " in "+ toUser.firstName,
            data: data
         });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

//accept and reject upcoming request from toUserId
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
       
        const loggedInUser = req.user;
        const {status,requestId} = req.params;
        
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(404).json({message:"Status is not valid!"});
        }

        // Code here will only run if the status is valid.
        const connectionRequest = await ConnectionRequest.findOne({
                _id:requestId,
                toUserId:loggedInUser._id,
                status:"interested"
            });

            
        if(!connectionRequest){
           return res
           .send(404)
           .json({message:"Connection request not found!!"});
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message:"Connection request " + status,
            data : data
        });

    }catch(err){
        res.status(400).send("ERROR" + err.message);
    }
});

module.exports = {requestRouter};