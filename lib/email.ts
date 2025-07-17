import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface ESIMEmailData {
  userEmail: string
  userName: string
  planName: string
  country: string
  dataAmount: string
  days: number
  price: number
  currency: string
  qrCodeUrl: string
  activationCode: string
  iccid: string
  expiresAt: string
}

export async function sendESIMEmail(data: ESIMEmailData) {
  const {
    userEmail,
    userName,
    planName,
    country,
    dataAmount,
    days,
    price,
    currency,
    qrCodeUrl,
    activationCode,
    iccid,
    expiresAt
  } = data

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your eSIM is Ready! - SIMRYO</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0066cc, #0099ff); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .esim-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc; }
        .qr-section { text-align: center; margin: 30px 0; }
        .qr-code { max-width: 200px; border: 2px solid #ddd; border-radius: 8px; }
        .button { display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .highlight { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Your eSIM is Ready!</h1>
          <p>Welcome to global connectivity with SIMRYO</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your eSIM has been successfully activated and is ready to use! Here are your plan details:</p>
          
          <div class="esim-details">
            <h3>📱 Plan Details</h3>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Data:</strong> ${dataAmount}</p>
            <p><strong>Validity:</strong> ${days} days</p>
            <p><strong>Price:</strong> ${currency} ${price}</p>
            <p><strong>Expires:</strong> ${expiresAt}</p>
          </div>
          
          <div class="highlight">
            <h3>🔑 Activation Information</h3>
            <p><strong>ICCID:</strong> ${iccid}</p>
            <p><strong>Activation Code:</strong> ${activationCode}</p>
          </div>
          
          <div class="qr-section">
            <h3>📱 Scan QR Code to Activate</h3>
            <img src="${qrCodeUrl}" alt="eSIM QR Code" class="qr-code">
            <p><small>Scan this QR code with your phone's camera or go to Settings > Cellular > Add Cellular Plan</small></p>
          </div>
          
          <h3>📋 How to Activate Your eSIM</h3>
          <ol>
            <li>Go to your phone's <strong>Settings</strong></li>
            <li>Tap <strong>Cellular</strong> or <strong>Mobile Data</strong></li>
            <li>Tap <strong>Add Cellular Plan</strong> or <strong>Add eSIM</strong></li>
            <li>Scan the QR code above or enter the activation code manually</li>
            <li>Follow the on-screen instructions</li>
            <li>Your eSIM will be activated and ready to use!</li>
          </ol>
          
          <div class="highlight">
            <h3>💡 Pro Tips</h3>
            <ul>
              <li>Keep your original SIM card active for calls and SMS</li>
              <li>Use the eSIM for data while traveling</li>
              <li>Monitor your data usage in Settings > Cellular</li>
              <li>Contact us if you need help with activation</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://simryo.com/profile" class="button">View in Dashboard</a>
            <a href="https://simryo.com/support" class="button">Get Support</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing SIMRYO!</p>
          <p>Questions? Contact us at <a href="mailto:support@simryo.com">support@simryo.com</a></p>
          <p>© 2024 SIMRYO. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const emailText = `
Your eSIM is Ready! - SIMRYO

Hello ${userName},

Your eSIM has been successfully activated and is ready to use!

Plan Details:
- Plan: ${planName}
- Country: ${country}
- Data: ${dataAmount}
- Validity: ${days} days
- Price: ${currency} ${price}
- Expires: ${expiresAt}

Activation Information:
- ICCID: ${iccid}
- Activation Code: ${activationCode}

How to Activate:
1. Go to your phone's Settings
2. Tap Cellular or Mobile Data
3. Tap Add Cellular Plan or Add eSIM
4. Scan the QR code or enter the activation code manually
5. Follow the on-screen instructions

View your eSIM in your dashboard: https://simryo.com/profile

Need help? Contact us at support@simryo.com

Thank you for choosing SIMRYO!
  `

  try {
    const mailOptions = {
      from: `"SIMRYO" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: '🎉 Your eSIM is Ready! - SIMRYO',
      html: emailHtml,
      text: emailText,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('eSIM email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send eSIM email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendOrderConfirmationEmail(userEmail: string, userName: string, orderId: string, amount: number, currency: string) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - SIMRYO</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0066cc, #0099ff); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your order has been confirmed and is being processed. You'll receive your eSIM details shortly!</p>
          
          <div class="order-details">
            <h3>📋 Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong> ${currency} ${amount}</p>
            <p><strong>Status:</strong> Processing</p>
          </div>
          
          <p>We're preparing your eSIM and will send you the activation details via email within the next few minutes.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://simryo.com/profile" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Order Status</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing SIMRYO!</p>
          <p>Questions? Contact us at <a href="mailto:support@simryo.com">support@simryo.com</a></p>
          <p>© 2024 SIMRYO. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const mailOptions = {
      from: `"SIMRYO" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: '✅ Order Confirmed - SIMRYO',
      html: emailHtml,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

interface PasswordResetEmailData {
  email: string
  name: string
  resetToken: string
  resetUrl: string
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const { email, name, resetToken, resetUrl } = data

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request - SIMRYO</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0066cc, #0099ff); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reset-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35; }
        .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; color: #856404; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #ffeaa7; }
        .code { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Password Reset Request</h1>
          <p>Reset your SIMRYO account password</p>
        </div>
        
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>We received a request to reset your password for your SIMRYO account.</p>
          
          <div class="reset-section">
            <h3>🔑 Reset Your Password</h3>
            <p>Click the button below to reset your password. This link will expire in 10 minutes for security.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p><small>If the button doesn't work, copy and paste this link into your browser:</small></p>
            <div class="code">${resetUrl}</div>
          </div>
          
          <div class="warning">
            <h4>⚠️ Security Notice</h4>
            <ul>
              <li>This link expires in 10 minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Never share this link with anyone</li>
              <li>Contact support if you have concerns</li>
            </ul>
          </div>
          
          <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        
        <div class="footer">
          <p>Stay secure with SIMRYO!</p>
          <p>Questions? Contact us at <a href="mailto:support@simryo.com">support@simryo.com</a></p>
          <p>© 2024 SIMRYO. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const mailOptions = {
      from: `"SIMRYO Security" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔒 Password Reset Request - SIMRYO',
      html: emailHtml,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
} 