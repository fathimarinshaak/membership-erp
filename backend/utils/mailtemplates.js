const COMPANY_NAME = process.env.COMPANY_NAME || 'ERP System';

exports.accessLinkTemplate = (link) => ({
  subject: `${COMPANY_NAME} – Your Access Link`,
  html: `
    <h3>Welcome to ${COMPANY_NAME}</h3>
    <p>Click below to access your account:</p>
    <a href="${link}">${link}</a>
    <p>This link expires in 30 days.</p>
    <p>This link is private. Do not share.</p>
  `
});

exports.expirySoonTemplate = (name, planName, daysLeft) => ({
  subject: `⏰ ${COMPANY_NAME} – Membership Expiring Soon`,
  html: `
    <h3>Hello ${name},</h3>
    <p>Your <b>${planName}</b> plan expires in <b>${daysLeft} day(s)</b>.</p>
    <br/>
    <p>— ${COMPANY_NAME}</p>
  `
});

exports.expiredTemplate = (name, planName) => ({
  subject: `❌ ${COMPANY_NAME} – Membership Expired`,
  html: `
    <h3>Hello ${name},</h3>
    <p>Your <b>${planName}</b> membership has expired.</p>
    <p>Please contact admin .</p>
    <br/>
    <p>— ${COMPANY_NAME}</p>
  `
});
