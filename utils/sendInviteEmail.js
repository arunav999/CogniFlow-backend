import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const sendInviteEmail = async ({ email, inviteLink, workspaceName }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // SMTP username
      pass: process.env.SMTP_PASSWORD, // SMTP password
    },
  });

  const mailOptions = {
    from: `"Cogniflow" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `You're invited to join ${workspaceName} on Cogniflow`,
    html: `
      <h3>You've been invited to join <strong>${workspaceName}</strong></h3>
      <p>Click the button below to accept your invitation:</p>
      <a href="${inviteLink}" style="padding:10px 20px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none;">Accept Invite</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendInviteEmail;