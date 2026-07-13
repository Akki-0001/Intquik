const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/user.model");
const { sendSubscriptionEmail, sendInvoiceEmail } = require("../utils/email");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mockKeyId1234",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mockKeySecret5678",
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { plan } = req.body;
    
    const planPrices = {
      Starter: 699,
      Professional: 1599,
      Enterprise: 3499,
      Growth: 1599,
    };

    const amount = planPrices[plan] || 1599;

    // Razorpay amount is in paise (1 INR = 100 paise)
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // If key is default mock test key, bypass Razorpay order creation and return a mock order ID
    if (process.env.RAZORPAY_KEY_ID === "rzp_test_mockKeyId1234" || !process.env.RAZORPAY_KEY_ID) {
      return res.status(200).json({
        success: true,
        orderId: `order_mock_${Math.floor(100000 + Math.random() * 900000)}`,
        amount: options.amount,
        currency: options.currency,
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_mockKeyId1234",
        isMock: true,
      });
    }

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify-payment
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !plan) {
      res.status(400);
      throw new Error("Missing payment verification details");
    }

    // Bypass actual signature validation if we are in mock mode
    let isSignatureValid = false;
    if (razorpay_order_id.startsWith("order_mock_")) {
      isSignatureValid = true;
    } else {
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mockKeySecret5678");
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");
      isSignatureValid = generated_signature === razorpay_signature;
    }

    if (!isSignatureValid) {
      res.status(400);
      throw new Error("Payment signature verification failed");
    }

    // Update user's subscription
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.subscription.plan = plan;
    user.subscription.status = "Active";
    user.subscription.endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year renewal

    const updatedUser = await user.save();

    // Generate Invoice details
    const planPrices = {
      Starter: "₹699",
      Professional: "₹1,599",
      Enterprise: "₹3,499",
      Growth: "₹1,599",
    };
    const amountStr = planPrices[plan] || "₹1,599";
    const invoiceId = "INV-" + Math.floor(100000 + Math.random() * 900000);

    // Send emails
    sendSubscriptionEmail(updatedUser, plan, "Active")
      .catch(err => console.error("Failed to send subscription confirmation email:", err.message));
    sendInvoiceEmail(updatedUser, plan, amountStr, invoiceId)
      .catch(err => console.error("Failed to send invoice email:", err.message));

    res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated successfully",
      subscription: updatedUser.subscription,
      invoice: {
        id: invoiceId,
        amount: amountStr,
        date: new Date().toLocaleDateString("en-GB"),
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
