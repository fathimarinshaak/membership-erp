const nodemailer = require('nodemailer');

const COMPANY_NAME = process.env.COMPANY_NAME || 'ERP System';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
module.exports = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
