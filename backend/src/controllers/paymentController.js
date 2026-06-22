const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const crypto = require("crypto");
/*
=====================================
CREATE PAYMENT ORDER
=====================================
*/

exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    console.log("Booking ID =>", bookingId);

    const booking = await Booking.findById(bookingId);

    console.log("Booking Found =>", booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const options = {
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: booking._id.toString(),
    };

    console.log("Razorpay Options =>", options);

    const order = await razorpay.orders.create(options);

    console.log("Razorpay Order =>", order);

    const payment = await Payment.create({
      booking: booking._id,
      customer: req.user._id,
      amount: booking.totalAmount,
      transactionId: order.id,
    });

    console.log("Payment Created =>", payment);

    res.status(200).json({
      success: true,
      order,
      payment,
    });
  } catch (error) {
    console.error("PAYMENT ERROR =>");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    const payment = await Payment.findOne({
      transactionId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.status = "paid";
    payment.transactionId = razorpay_payment_id;

    await payment.save();

    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: "paid",
    });

    res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
