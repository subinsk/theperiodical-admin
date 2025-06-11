// lib/email.ts
import nodemailer from 'nodemailer';

interface InvitationEmailData {
  to: string;
  inviterName: string;
  organizationName: string;
  role: string;
  acceptUrl: string;
  expiresAt: Date;
}

// Create transporter (configure based on your email provider)
const createTransporter = () => {
  // For Gmail
//   if (process.env.EMAIL_PROVIDER === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Use app password, not regular password
      },
    });
//   }

  // For custom SMTP
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT || '587'),
//     secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });
};

export async function sendInvitationEmail(data: InvitationEmailData) {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation to join ${data.organizationName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">You're invited to join ${data.organizationName}!</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px;">Hi there!</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            <strong>${data.inviterName}</strong> has invited you to join <strong>${data.organizationName}</strong> 
            as a <strong>${data.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.acceptUrl}" 
               style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
            <strong>This invitation will expire on ${data.expiresAt.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}.</strong>
          </p>
          
          <p style="font-size: 14px; color: #666;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
        
        <div style="font-size: 12px; color: #999; text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
          <p>This email was sent by ${data.organizationName}</p>
          <p>If you can't click the button above, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${data.acceptUrl}</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${data.organizationName}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: data.to,
      subject: `Invitation to join ${data.organizationName}`,
      html: emailContent,
      // Optional: Add plain text version
      text: `
        You're invited to join ${data.organizationName}!
        
        ${data.inviterName} has invited you to join ${data.organizationName} as a ${data.role.replace('_', ' ')}.
        
        Accept your invitation by visiting: ${data.acceptUrl}
        
        This invitation will expire on ${data.expiresAt.toLocaleDateString()}.
        
        If you didn't expect this invitation, you can safely ignore this email.
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Invitation email sent successfully:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
}