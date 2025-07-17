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
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #4f46e5;">👋 Invitation to ${workspaceName}</h2>
      <p>Hello,</p>
      <p>You’ve been invited to join the workspace <strong>${workspaceName}</strong> on <strong>Cogniflow</strong>.</p>
      <p>Click the button below to accept your invitation:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Accept Invite</a>
      <p style="margin-top: 20px;">This link will expire in 15 minutes.</p>
      <hr style="margin-top: 30px;">
      <p style="font-size: 12px; color: gray;">If you did not expect this invitation, you can ignore this email.</p>
    </div>
   <p>This link will expire in 15 minutes.</p>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendInviteEmail;
