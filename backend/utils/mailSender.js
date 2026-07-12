import nodemailer from 'nodemailer';

/**
 * Send an email using nodemailer SMTP transport
 * 
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Subject line
 * @param {string} params.text - Plain text content
 * @param {string} [params.html] - HTML content
 * @returns {Promise<Object>} Nodemailer send info
 */
export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"TransitOps Support" <no-reply@transitops.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email via nodemailer:', error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};
