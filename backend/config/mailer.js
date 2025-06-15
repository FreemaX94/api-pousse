const nodemailer = require("nodemailer");
const { email } = require("./config");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email.user,
    pass: email.pass,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    logger.error("❌ Erreur configuration email :", error);
  } else {
    logger.log("✅ Transporteur email prêt à envoyer des messages");
  }
});

module.exports = transporter;
