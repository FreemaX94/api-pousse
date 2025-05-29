(async () => {
// backend/services/mailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Vérifiez votre adresse e-mail',
    html: `
      <p>Bienvenue ! Cliquez sur ce lien pour vérifier votre adresse :</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `
  });
}
})();