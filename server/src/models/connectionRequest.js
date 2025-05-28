const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    
    fromUserId:{
        //Type object user ID.
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference to the "userSchema" collection.
        required: true, 
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference to the "userSchema" collection.
        required: true,
    },
    status:{
        type: String,
        //enum are use to restrict value for some users.
        enum:{
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `Invalid status type`
        }
    }
},
{
     timestamps: true
});

//compound index - index we are using to make query fast.
//ConnectionRequest.find({fromUserId:id,toUserId;id})
//1 means ascending order and -1 descending order.
connectionRequestSchema.index({fromUserId: 1});

//whenever save method will called, it will pre saved.
//Before we save it, pre function will be called.
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    //CHECK IF THE fromUserid AS SAME AS toUserid.
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!")
    }
    next();
});
 
//model always start with a capital letter.
const ConnectionRequestModel = mongoose.model('ConnectionRequestModel', connectionRequestSchema);

module.exports = ConnectionRequestModel;
