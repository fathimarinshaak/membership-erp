const cron = require("node-cron");
const Membership = require("../model/Membership");
const Member = require("../model/Member");
const sendMail = require("../utils/nodemailer");
const {
  expirySoonTemplate,
  expiredTemplate
} = require("../utils/mailtemplates");

console.log("✅ Membership reminder cron loaded");
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running membership reminder job...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const in3Days = new Date(today);
  in3Days.setDate(today.getDate() + 3);

  const in1Day = new Date(today);
  in1Day.setDate(today.getDate() + 1);

  try {
    const memberships = await Membership.find({ status: "ACTIVE" })
      .populate("memberId")
      .populate("planId");

    for (const m of memberships) {
      if (!m.memberId || !m.planId) continue;

      const expiry = new Date(m.endDate);
      expiry.setHours(0, 0, 0, 0);

      const member = m.memberId;
      const plan = m.planId;

      /* 🔔 3 DAYS BEFORE */
      if (expiry.getTime() === in3Days.getTime()) {
        const mail = expirySoonTemplate(
          member.name,
          plan.name,
          3
        );
        await sendMail(member.email, mail.subject, mail.html);
      }

      /* 🔔 1 DAY BEFORE */
      if (expiry.getTime() === in1Day.getTime()) {
        const mail = expirySoonTemplate(
          member.name,
          plan.name,
          1
        );
        await sendMail(member.email, mail.subject, mail.html);
      }

      /* ❌ EXPIRED */
      if (expiry.getTime() < today.getTime()) {
        const mail = expiredTemplate(
          member.name,
          plan.name
        );
        await sendMail(member.email, mail.subject, mail.html);

        // optional: mark expired (NO model change)
        m.status = "EXPIRED";
        await m.save();
      }
    }

    console.log("✅ Membership reminder job finished");
  } catch (err) {
    console.error("❌ Reminder job error:", err);
  }
});
