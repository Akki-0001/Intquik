require("dotenv").config();
const {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendSubscriptionEmail,
  sendInvoiceEmail,
} = require("./src/utils/email");

const runTests = async () => {
  console.log("Starting transactional email delivery tests...");
  
  const mockUser = {
    name: "Alex Johnson",
    email: "iakhilyadav15@gmail.com",
    companyName: "Aura Boutique",
    subscription: {
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  };

  try {
    console.log("\n1. Testing Welcome Email...");
    const welcomeResult = await sendWelcomeEmail(mockUser);
    console.log("Welcome Email Result:", welcomeResult);

    console.log("\n2. Testing Forgot Password Email...");
    const forgotResult = await sendForgotPasswordEmail(
      mockUser,
      "582046"
    );
    console.log("Forgot Password Result:", forgotResult);

    console.log("\n3. Testing Subscription Update Email...");
    const subResult = await sendSubscriptionEmail(mockUser, "Professional", "Active");
    console.log("Subscription Email Result:", subResult);

    console.log("\n4. Testing Invoice Email...");
    const invoiceResult = await sendInvoiceEmail(mockUser, "Professional", "₹1,599/yr", "INV-123456");
    console.log("Invoice Email Result:", invoiceResult);

    console.log("\nAll email test triggers executed successfully.");
  } catch (err) {
    console.error("Test failed with error:", err.message);
  }
};

runTests();
