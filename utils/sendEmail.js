const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ajshajimmax7878@gmail.com",
        pass: "adokgxohyhdotqon",
    },
});

const sendEmail = async (to, subject, html,text) => {
    const mailOptions = {
        from: '"Master Tools BD" <ajshajimmax7878@gmail.com>',
        to,
        subject,
        html,
        text
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;




//   async sendPasswordResetEmail(user, resetLink) {
//     const mailOptions = {
//       from: "${process.env.APP_NAME || 'Your App'}" <${process.env.EMAIL_FROM || 'no-reply@yourdomain.com'}>,
//       to: user.email,
//       subject: 'Reset Your Password',
//       html: this.getResetEmailHtml(user, resetLink),
//       text: this.getResetEmailText(user, resetLink)
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('Password reset email sent:', info.messageId);
//       return true;
//     } catch (error) {
//       console.error('Error sending password reset email:', error);
//       throw new Error('Failed to send password reset email');
//     }
//   }