const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../Utils/razorpay");
const Payment = require("../models/payment");
const {membershipAmount} = require("../Utils/constants");
const{validateWebhookSignature} = require('razorpay/dist/utils/razorpat-utils');
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {

    const {firstName, lastName, emailId} = req.user;
    
    const {membershipType} = req.body;

    // Create Razorpay order.
    const order = await razorpayInstance.orders.create({
      amount:membershipAmount[membershipType]*100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType
      }
    });

    // Save payment info in DB
    const payment = new Payment({
      userID: req.user._id, //This is how we know which user created payment.(authUser)
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes
    });

    const savedPayment = await payment.save();

    // Return to frontend
    res.status(201).json({savedPayment, keyId:process.env.RAZORPAY_KEY_ID});

  } catch (err) {
    console.error("Payment creation failed:", err);
    res.status(500).json({ msg: "Payment creation failed. Try again later." });
  }
});

//This route razorpay will called to verify payment.
paymentRouter.post("/payment/webhook",async(req,res)=>{
    try{

      const webhookSignature = req.get("x-razorpay-signature");
      
      const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
      );

      if(!isWebhookValid){
        return res.status(400).json({msg:"Webhook signature is invalid"});
      }

      //update my payment status in DB
      const paymentDetails = req.body.payload.payment.entity;
      const payment = await Payment.findOne({orderId:paymentDetails.order_Id});
      payment.status = paymentDetails.status; //status would be either "captured(success) or failed"
      await payment.save();


      //update the user as premium
      const user = await User.findOne({_id:payment.userId});
      user.isPremium = true;
      user.membershipType = payment.notes.membershipType; //either gold or silver
      await user.save();

      // if(req.body.event ==="payment.captured"){
      // }

      // if(req.body.event ==="payment.failed"){
      // }

      //return success response to razorpay
      return res.status(200).json({msg:"Webhook received successfully"});

    }catch(err){
        return res.status(500).json({msg:err.message});
    }
})

//verify Premium
paymentRouter.get("/premium/verify", userAuth,async(req,res)=>{
    const user = req.user;
    if(user.isPremium){
      return res.json({isPremium:true});
    }
    return res.json({isPremium:false});
})

module.exports = paymentRouter;