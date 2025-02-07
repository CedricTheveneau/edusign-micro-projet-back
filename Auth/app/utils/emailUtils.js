const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (userEmail, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
  port: 587,
  secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.trim(),
    },
  });

  const mailOptions = {
    from: `"Cédric de Edusign" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };