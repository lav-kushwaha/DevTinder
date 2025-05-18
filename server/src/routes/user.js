const express = require("express");
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
//Get all the pending connections request of loggedIn user.
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
    try{

        const loggedInUser = req.user;
        //find returns array and findOne returns you an objects.
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",USER_SAFE_DATA); //.populate("fromUserId");  //if we will pass only fromUserId then we will get all the info of "fromUserId" which is Over-fetching data, and it is not good things to do, we have to explicitly mention in array or string to get data.
        //.populate("fromUserId","firstName lastName"); //we can write in the string also it is perfectly valid.

       res.json({
            message:"Data fetched successfully..",
            data:connectionRequests,
       });

    }catch(err){
        res.sendStatus(400).send("ERROR "+ err.message);
    }
});

//user connections
userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id, status:"accepted"},
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        });

        res.json({
            data : data
        });

    }catch(err){
        res.status(400).send("ERROR "+err.message);
    }
});

//feed API and pagination
//feed?page=1&limit=10
userRouter.get("/feed",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) ||10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        
        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId");

        //set contain unique element.
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        //finding user who are not in the hideUserFromFeed and their id is not equal to the loggedInUserId.
        const users = await user.find({
            $and:[
                {_id:{$nin:Array.from(hideUserFromFeed)}},//not in($nin)
                {_id:{$ne:loggedInUser._id}},//not equal ($ne)
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send(users);

    }catch(err){
        res.status(400).json({message:err.message});
    }
});

module.exports = {userRouter};