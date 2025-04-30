import { NODEMAILEREMAIL,CLIENTURL } from "../../config/env";
import transporter from "./emailTransporter";

export const sendGroupInviteEmail = async (
    email: string,
    groupName: string,
    acceptLink: string,
    existingUser: boolean
) => {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>Hello "${email}",<h1>
      <h2>You're Invited to Join a Group on ExpenX</h2>
      <p>You've been invited to join the group <strong>${groupName}</strong> from the ExpenX app.</p>
      ${existingUser
            ? `<p>Click below to accept the invitation and join the group:</p>
             <a href="${CLIENTURL}${acceptLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Accept Invitation</a>`
            : `<p>You don't have an account yet. Join <strong>ExpenX</strong> to manage and share group expenses effortlessly.</p>
             <p><strong>What is ExpenX?</strong></p>
             <p>ExpenX is a smart expense tracking app that helps friends, families, and teams split bills, settle balances, and stay financially organized together.</p>
             <p>You've been invited to join the group <strong>${groupName}</strong>. After creating your account, you'll automatically be added to the group.</p>
             <a href="${CLIENTURL}/register?redirect=${encodeURIComponent(acceptLink)}"
             style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 4px;">Create Account & Accept Invite</a>`
        }
      <p style="margin-top: 20px;">Thank you,<br/>The ExpenX Team</p>
    </div>
  `;

    const mailOptions = {
        from: NODEMAILEREMAIL,
        to: email,
        subject: "Group Invitation",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Error sending group invite email:", err);
        throw new Error("Failed to send group invite email");
    }
};
