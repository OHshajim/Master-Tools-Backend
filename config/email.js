const dotenv = require("dotenv");
dotenv.config();

exports.getResetEmailHtml = (user, resetLink) => {
    const appName = process.env.APP_NAME || "Your App";
    const year = new Date().getFullYear();
    const logoUrl = process.env.EMAIL_LOGO_URL;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f7fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .header {
          background-color: #4f46e5;
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4f46e5;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 20px 0;
        }
        @media only screen and (max-width: 600px) {
          .container {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-container">
          <div class="header">
          <img src="${logoUrl}" width="64" height="64" alt="${appName} Logo" class="logo">
        
            <h1>Password Reset</h1>
          </div>
          
          <div class="content">
            <p>Hello ${user.name || "there"},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 30px 0; color:white ">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p>If you didn't request this password reset, please ignore this email or contact our support team if you have any concerns.</p>
            
            <div class="divider"></div>
            
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Note:</strong> This password reset link will expire in 1 hour. If you need a new link, you can request another password reset on our website.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; ${year} ${appName}. All rights reserved.</p>
            <p>If you're having trouble with the button above, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; font-size: 11px; color: #4b5563;">${resetLink}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
};

exports.getResetEmailText = (user, resetLink) => {
    const appName = process.env.APP_NAME || "Your App";
    return `Hello ${user.name || "there"},

        We received a request to reset your password for ${appName}. Please use the following link to reset your password:

        ${resetLink}

        This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.

        Thank you,
        The ${appName} Team`;
};
