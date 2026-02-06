const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (to, link) => {
  await transporter.sendMail({
    from: `"ERP System" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your ERP Access Link',
    html: `
      <h3>Welcome to ERP</h3>
      <p>Click below to access your account:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 15 minutes.</p>
    `
  });
};
