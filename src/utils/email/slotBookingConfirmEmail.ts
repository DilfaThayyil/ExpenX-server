import transporter from './emailTransporter';

export const sendBookingConfirmationEmail = async (
  to: string,
  username: string,
  slotDate: string,
  startTime: string
) => {
  const htmlContent = `
    <h3>Hello ${username},</h3>
    <p>Your slot has been successfully booked.</p>
    <ul>
      <li><strong>Date:</strong> ${slotDate}</li>
      <li><strong>Start Time:</strong> ${startTime}</li>
    </ul>
    <p>Thank you!</p>
  `;

  const mailOptions = {
    from: `"Expense Tracker"`,
    to,
    subject: "Slot Booking Confirmation",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Error sending email');
  }
};
