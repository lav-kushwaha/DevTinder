const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../Utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../Utils/constants");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

// Create a payment order
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    const { membershipType } = req.body;

    if (!membershipAmount[membershipType]) {
      return res.status(400).json({ msg: "Invalid membership type." });
    }

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    // Save order to DB
    const payment = new Payment({
      userID: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      savedPayment,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Payment creation failed:", err);
    res.status(500).json({ msg: "Payment creation failed. Try again later." });
  }
});

// Razorpay webhook callback
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("x-razorpay-signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    // Find payment by orderId
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

    if (!payment) {
      return res.status(404).json({ msg: "Payment record not found" });
    }

    // Update payment status
    payment.status = paymentDetails.status;
    await payment.save();

    // Only update user if payment is captured
    if (paymentDetails.status === "captured") {
      const user = await User.findById(payment.userID);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;
      await user.save();
    }

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ msg: err.message });
  }
});

// Verify Premium Status
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user;
  res.json({ isPremium: user.isPremium || false });
});

module.exports = paymentRouter;
