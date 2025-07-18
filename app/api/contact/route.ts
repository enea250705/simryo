import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, company, subject, message } = await request.json()
    
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName}`
    const companyInfo = company ? `\nCompany: ${company}` : ''

    // Create HTML email content for admin notification
    const adminHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission - SIMRYO</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .field { margin: 15px 0; }
    .field-label { font-weight: bold; color: #374151; }
    .field-value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
    .message-content { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌍 SIMRYO</h1>
      <p>New Contact Form Submission</p>
    </div>
    
    <div class="content">
      <h2>Contact Details</h2>
      
      <div class="field">
        <div class="field-label">Name:</div>
        <div class="field-value">${fullName}</div>
      </div>
      
      <div class="field">
        <div class="field-label">Email:</div>
        <div class="field-value">${email}</div>
      </div>
      
      ${company ? `
      <div class="field">
        <div class="field-label">Company:</div>
        <div class="field-value">${company}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="field-label">Subject:</div>
        <div class="field-value">${subject}</div>
      </div>
      
      <div class="field">
        <div class="field-label">Message:</div>
        <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>This message was sent via the SIMRYO contact form.</p>
      <p>Submitted on: ${new Date().toLocaleString()}</p>
      <p>Reply to: ${email}</p>
    </div>
  </div>
</body>
</html>
    `

    // Create HTML email content for customer confirmation
    const customerHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Contacting SIMRYO</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .highlight { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌍 SIMRYO</h1>
      <p>Thank You for Contacting Us!</p>
    </div>
    
    <div class="content">
      <p>Hi ${firstName},</p>
      
      <p>Thank you for reaching out to SIMRYO! We've received your message and will get back to you as soon as possible.</p>
      
      <div class="highlight">
        <h3>Your Message Summary:</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <p>Our team typically responds within 24 hours during business days. If you have an urgent matter, please don't hesitate to reach out to us directly at <strong>info@simryo.com</strong>.</p>
      
      <p>In the meantime, you might find answers to common questions in our <a href="https://simryo.com/faq" style="color: #2563eb;">FAQ section</a> or <a href="https://simryo.com/setup" style="color: #2563eb;">Setup Guide</a>.</p>
      
      <p>Thank you for choosing SIMRYO for your global connectivity needs!</p>
      
      <p>Best regards,<br>
      The SIMRYO Team</p>
    </div>
    
    <div class="footer">
      <p>Stay connected worldwide 🌍</p>
      <p>This confirmation was sent to: ${email}</p>
      <p>SIMRYO - Your Global eSIM Provider</p>
    </div>
  </div>
</body>
</html>
    `

    // Send emails using Resend
    if (resend && process.env.RESEND_API_KEY) {
      try {
        // Send notification to admin
        const adminEmail = await resend.emails.send({
          from: 'SIMRYO Contact Form <noreply@simryo.com>',
          to: ['info@simryo.com'], // Change to your admin email
          subject: `New Contact Form: ${subject}`,
          html: adminHtmlContent,
          replyTo: email
        })

        // Send confirmation to customer
        const customerEmail = await resend.emails.send({
          from: 'SIMRYO Support <info@simryo.com>',
          to: [email],
          subject: 'Thank you for contacting SIMRYO',
          html: customerHtmlContent,
        })

        if (adminEmail.error || customerEmail.error) {
          console.error('Resend errors:', { 
            admin: adminEmail.error, 
            customer: customerEmail.error 
          })
          throw new Error('Failed to send one or more emails')
        }

        console.log('📧 Contact form emails sent successfully:', {
          admin: adminEmail.data?.id,
          customer: customerEmail.data?.id
        })
        
        return NextResponse.json({
          success: true,
          message: 'Your message has been sent successfully! We\'ll get back to you soon.',
          adminEmailId: adminEmail.data?.id,
          customerEmailId: customerEmail.data?.id
        })
      } catch (resendError) {
        console.error('Failed to send emails via Resend:', resendError)
        
        // Fall back to logging for development
        console.log('📧 Contact form submission would be sent:', {
          from: email,
          subject: subject,
          message: message
        })
        
        return NextResponse.json({
          success: true,
          message: 'Your message has been received (logged for development)',
        })
      }
    } else {
      // Development mode - just log
      console.log('📧 Contact form submission:', {
        name: fullName,
        email,
        company,
        subject,
        message,
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json({
        success: true,
        message: 'Your message has been received (development mode)',
      })
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}