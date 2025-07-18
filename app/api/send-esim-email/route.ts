import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { email, name, orderItems } = await request.json()
    
    if (!email || !orderItems) {
      return NextResponse.json(
        { success: false, error: 'Email and order items are required' },
        { status: 400 }
      )
    }

    // Create HTML email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your SIMRYO eSIM Purchase</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .esim-item { border: 1px solid #e5e7eb; margin: 20px 0; padding: 20px; border-radius: 8px; }
    .qr-code { text-align: center; margin: 20px 0; }
    .qr-code img { max-width: 200px; height: 200px; }
    .instructions { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌍 SIMRYO</h1>
      <p>Your eSIM Purchase is Ready!</p>
    </div>
    
    <div style="padding: 20px;">
      <p>Hi ${name || 'Customer'},</p>
      <p>Thank you for your purchase! Your eSIM${orderItems.length > 1 ? 's are' : ' is'} now ready for activation.</p>
      
      ${orderItems.map((item: any) => `
        <div class="esim-item">
          <h3>${item.flag} ${item.countryName}</h3>
          <p><strong>Plan:</strong> ${item.plan.data} for ${item.plan.days} days</p>
          <p><strong>Price:</strong> $${item.plan.price}</p>
          
          <div class="qr-code">
            <h4>QR Code for Activation:</h4>
            <img src="${item.qrCodeUrl}" alt="QR Code for ${item.countryName}">
          </div>
          
          <p><strong>Activation Code:</strong> <code>${item.activationCode}</code></p>
          
          <div class="instructions">
            <h4>📱 How to Install Your eSIM:</h4>
            <ol>
              ${item.instructions.map((instruction: string) => `<li>${instruction}</li>`).join('')}
            </ol>
          </div>
        </div>
      `).join('')}
      
      <p><strong>Important Notes:</strong></p>
      <ul>
        <li>Keep this email safe - you'll need it to activate your eSIM</li>
        <li>Your eSIM will activate when you first connect to a network in your destination</li>
        <li>Make sure your device supports eSIM technology</li>
        <li>Contact our support team if you need help: info@simryo.com</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing SIMRYO!</p>
      <p>Stay connected worldwide 🌍</p>
      <p>This email was sent to: ${email}</p>
    </div>
  </div>
</body>
</html>
    `

    // Send real email using Resend
    if (resend && process.env.RESEND_API_KEY) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'SIMRYO <orders@simryo.com>',
          to: [email],
          subject: `Your SIMRYO eSIM Purchase - ${orderItems.length} item(s)`,
          html: htmlContent,
        })

        if (error) {
          console.error('Resend error:', error)
          throw new Error(error.message)
        }

        console.log('📧 Email sent successfully via Resend:', data)
        
        return NextResponse.json({
          success: true,
          message: 'Email sent successfully',
          recipient: email,
          itemCount: orderItems.length,
          emailId: data?.id
        })
      } catch (resendError) {
        console.error('Failed to send email via Resend:', resendError)
        
        // Fall back to logging for development
        console.log('📧 Email would be sent to:', email)
        console.log('Email content generated successfully')
        
        return NextResponse.json({
          success: true,
          message: 'Email logged (Resend failed)',
          recipient: email,
          itemCount: orderItems.length
        })
      }
    } else {
      // Development mode - just log
      console.log('📧 Email would be sent to:', email)
      console.log('Email content generated successfully')
      
      return NextResponse.json({
        success: true,
        message: 'Email logged (no API key)',
        recipient: email,
        itemCount: orderItems.length
      })
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}