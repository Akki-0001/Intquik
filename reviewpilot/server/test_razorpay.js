require("dotenv").config({ path: "./.env" });
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function test() {
  try {
    const order = await razorpay.orders.create({
      amount: 159900,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    console.log("Success:", order);
  } catch (error) {
    console.error("Razorpay Error:", error);
  }
}

test();
