// backend/services/mailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Réinitialisation du mot de passe',
    html: `<p>Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });
};
