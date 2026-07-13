const getEmailLayout = (title, content) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 48px 24px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.015);
    }
    .header {
      padding: 40px 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.05em;
      text-decoration: none;
    }
    .logo-blue {
      color: #2563eb;
    }
    .content {
      padding: 0 40px 40px;
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
    }
    h1 {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    p {
      margin: 0 0 16px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 12px;
      margin: 20px 0;
      text-align: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 40px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    .invoice-table th {
      text-align: left;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
    }
    .invoice-table td {
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
    }
    .invoice-total {
      font-weight: 800;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="https://intuik.com" class="logo">Intui<span class="logo-blue">k</span></a>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>This email was sent by Intuik. &copy; 2026 Intuik Inc. All rights reserved.</p>
        <p>Need help? Contact our <a href="mailto:support@intuik.com">Support Team</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

const sendEmail = async ({ to, subject, html }) => {
  const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase();
  const brevoKey = process.env.BREVO_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  
  const senderName = process.env.EMAIL_SENDER_NAME || "Intuik";
  const senderEmail = process.env.EMAIL_SENDER_EMAIL || "noreply@intuik.com";

  if (!brevoKey && !resendKey) {
    console.warn(`[EMAIL STATE] No Email API keys configured (BREVO_API_KEY / RESEND_API_KEY missing). Mock email logged:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    return { success: true, mock: true };
  }

  // 1. Send via Resend
  if (provider === "resend" || (resendKey && !brevoKey)) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${senderName} <${senderEmail}>`,
          to: [to],
          subject: subject,
          html: html,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }
      console.log(`[EMAIL SUCCESS] Email sent to ${to} via Resend. ID: ${data.id || data.id_string}`);
      return { success: true, provider: "resend", id: data.id };
    } catch (err) {
      console.error(`[EMAIL ERROR] Failed to send via Resend:`, err.message);
      throw err;
    }
  }

  // 2. Send via Brevo (Default or fallback)
  if (provider === "brevo" || brevoKey) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: to,
            },
          ],
          subject: subject,
          htmlContent: html,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }
      console.log(`[EMAIL SUCCESS] Email sent to ${to} via Brevo. MessageID: ${data.messageId}`);
      return { success: true, provider: "brevo", id: data.messageId };
    } catch (err) {
      console.error(`[EMAIL ERROR] Failed to send via Brevo:`, err.message);
      throw err;
    }
  }
};

// --- Transactional Email Invokers ---

const sendWelcomeEmail = async (user) => {
  const title = "Welcome to Intuik!";
  const html = getEmailLayout(title, `
    <h1>Welcome, ${user.name}!</h1>
    <p>We are absolutely thrilled to welcome you to <strong>Intuik</strong>. Your account has been set up successfully for <strong>${user.companyName || "your business"}</strong>.</p>
    <p>Intuik helps you capture premium reviews, customize visual table tent QR stands, order NFC cards, and utilize AI review-prompts to accelerate your local Google review acquisition.</p>
    <p>Get started by setting up your first business location and downloading your custom-tailored QR stand:</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/dashboard" class="btn">Access Your Dashboard</a>
    </div>
    <p>If you have any questions, our support team is available 24/7 to assist you.</p>
    <p>Let's grow together,<br>The Intuik Team</p>
  `);

  return sendEmail({ to: user.email, subject: title, html });
};

const sendForgotPasswordEmail = async (user, otpCode) => {
  const title = "Password Reset OTP - Intuik";
  const html = getEmailLayout(title, `
    <div style="margin-bottom: 24px;">
      <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin-bottom: 8px;">Password Reset Request</h1>
      <p style="font-size: 13px; color: #64748b; margin: 0;">Account: <strong>${user.email}</strong> ${user.companyName ? `• ${user.companyName}` : ''}</p>
    </div>
    
    <p>Hello ${user.name},</p>
    <p>We received a request to reset the password for your Intuik account. Please use the following One-Time Password (OTP) to verify your request:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; display: inline-block; padding: 18px 36px; letter-spacing: 6px; font-size: 32px; font-weight: 800; color: #0f172a; font-family: monospace;">
        ${otpCode}
      </div>
    </div>
    
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 16px; margin: 24px 0; font-size: 12px; color: #b45309;">
      <strong style="color: #92400e; font-size: 13px; display: block; margin-bottom: 6px;">🔒 Security Verification Notes:</strong>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
        <li>This secure OTP is valid for <strong>10 minutes</strong> and can only be used once.</li>
        <li>If you did not initiate this request, please ignore this email and your password will remain safe.</li>
        <li>Intuik support will never ask for your password or OTP over email or phone.</li>
      </ul>
    </div>
  `);

  return sendEmail({ to: user.email, subject: title, html });
};

const sendSubscriptionEmail = async (user, planName, status) => {
  const title = "Subscription Update - Intuik";
  const html = getEmailLayout(title, `
    <h1>Subscription Plan Confirmed</h1>
    <p>Hello ${user.name},</p>
    <p>We are writing to confirm that your subscription plan for <strong>${user.companyName}</strong> has been successfully updated.</p>
    <p>Here are your subscription details:</p>
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Detail</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Selected Plan</td>
          <td><strong>${planName}</strong></td>
        </tr>
        <tr>
          <td>Subscription Status</td>
          <td><span style="color: #10b981; font-weight: 800;">${status}</span></td>
        </tr>
        <tr>
          <td>Next Renewal Date</td>
          <td>${new Date(user.subscription.endDate).toLocaleDateString("en-GB")}</td>
        </tr>
      </tbody>
    </table>
    <p>Your premium features have been unlocked immediately! You can now manage your active slots and custom styles from your control center.</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/dashboard" class="btn">Go to Dashboard</a>
    </div>
    <p>Thank you for choosing Intuik,<br>The Intuik Team</p>
  `);

  return sendEmail({ to: user.email, subject: title, html });
};

const sendInvoiceEmail = async (user, planName, amount, invoiceId) => {
  const title = "Your Intuik Invoice";
  const dateStr = new Date().toLocaleDateString("en-GB");
  const html = getEmailLayout(title, `
    <h1>Invoice for Purchase</h1>
    <p>Hello ${user.name},</p>
    <p>Thank you for your payment! Here is the invoice receipt for your recent upgrade.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; font-size: 12px; line-height: 1.8;">
        <tr>
          <td style="color: #64748b;">Invoice ID:</td>
          <td style="text-align: right; font-weight: 700; color: #0f172a;">${invoiceId}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">Date:</td>
          <td style="text-align: right; font-weight: 700; color: #0f172a;">${dateStr}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">Customer:</td>
          <td style="text-align: right; font-weight: 700; color: #0f172a;">${user.name} (${user.companyName})</td>
        </tr>
      </table>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Intuik <strong>${planName} Plan</strong> (1 Year Subscription)</td>
          <td style="text-align: right; font-weight: 700;">${amount}</td>
        </tr>
        <tr class="invoice-total">
          <td style="padding-top: 16px; border-top: 1px solid #e2e8f0;">Total Paid</td>
          <td style="text-align: right; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #2563eb;">${amount}</td>
        </tr>
      </tbody>
    </table>
    
    <p style="font-size: 12px; color: #64748b; margin-top: 24px;">If you have any billing queries, please contact billing@intuik.com.</p>
  `);

  return sendEmail({ to: user.email, subject: `Invoice #${invoiceId} - Intuik`, html });
};

module.exports = {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendSubscriptionEmail,
  sendInvoiceEmail,
};
