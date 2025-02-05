// utils/emailUtils.js
const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (userEmail, subject, htmlContent) => {
  // Configuration du transporteur
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Assure-toi que le host est correct
  port: 587, // Port pour TLS
  secure: false, // true pour 465, false pour d'autres ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.trim(),
    },
  });

  // Configuration de l'email
  const mailOptions = {
    from: `"Cédric de Voyage Stoïque" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject, // Utilisation de la variable `subject`
    html: htmlContent, // Utilisation de la variable `htmlContent`
  };

  // Envoi de l'email
  return transporter.sendMail(mailOptions);
};

const sendContactEmail = async (userEmail, subject, htmlContent) => {
  // Configuration du transporteur
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Assure-toi que le host est correct
  port: 587, // Port pour TLS
  secure: false, // true pour 465, false pour d'autres ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.trim(),
    },
  });

  // Configuration de l'email
  const mailOptions = {
    from: `"Voyage Stoïque" <${process.env.EMAIL_USER}>`,
    to: `${process.env.EMAIL_USER}`,
    replyTo: userEmail,   
    subject, // Utilisation de la variable `subject`
    html: htmlContent, // Utilisation de la variable `htmlContent`
  };

  // Envoi de l'email
  return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail, sendContactEmail };