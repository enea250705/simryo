import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { customerInfo, orderItems, paymentIntentId } = await request.json()

    if (!customerInfo || !orderItems) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      )
    }

    // Create order summary for customer
    const orderSummary = orderItems.map((item: any, index: number) => {
      return `
${item.countryName} ${item.flag}
${item.plan.data} for ${item.plan.days} days
Network: ${item.plan.network?.type}
Price: $${item.plan.price}
      `.trim()
    }).join('\n\n')

    const totalAmount = orderItems.reduce((sum: number, item: any) => 
      sum + (item.plan.price * item.quantity), 0
    )

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Order Confirmation - SIMRYO</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .success-box { background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; }
            .order-box { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .total { font-size: 18px; font-weight: bold; color: #0066cc; }
            .delivery-info { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Order Confirmed!</h1>
                <p>Thank you for choosing SIMRYO</p>
            </div>
            
            <div class="content">
                <div class="success-box">
                    <h3>🎉 Payment Successful!</h3>
                    <p>Hi ${customerInfo.name},</p>
                    <p>Your payment has been processed successfully. Your eSIM order is now being prepared for delivery.</p>
                </div>

                <div class="order-box">
                    <h3>📱 Your Order Details:</h3>
                    <p><strong>Order ID:</strong> ${paymentIntentId}</p>
                    <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
                    <pre>${orderSummary}</pre>
                    <p class="total">💰 Total Paid: $${totalAmount.toFixed(2)}</p>
                </div>

                <div class="delivery-info">
                    <h3>📧 eSIM Delivery Information</h3>
                    <p><strong>⏰ Delivery Time:</strong> 10-15 minutes</p>
                    <p><strong>📨 Delivery Method:</strong> Email (to this address)</p>
                    <p><strong>📦 What You'll Receive:</strong></p>
                    <ul>
                        <li>eSIM QR code for easy installation</li>
                        <li>Manual activation code (backup)</li>
                        <li>Step-by-step setup instructions</li>
                        <li>Network and coverage information</li>
                    </ul>
                </div>

                <div class="order-box">
                    <h3>📋 What Happens Next?</h3>
                    <ol>
                        <li>🔄 Our team is processing your eSIM order</li>
                        <li>📧 You'll receive eSIM details within <strong>10-15 minutes</strong></li>
                        <li>📱 Follow the setup instructions to activate your eSIM</li>
                        <li>🌍 Enjoy instant connectivity!</li>
                    </ol>
                </div>

                <div class="delivery-info">
                    <h4>🚨 Important Notes:</h4>
                    <ul>
                        <li>Check your <strong>spam/junk folder</strong> if you don't see our email</li>
                        <li>eSIM activation requires a compatible device</li>
                        <li>Contact support if you don't receive your eSIM within 15 minutes</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <p><strong>Need Help?</strong></p>
                <p>📧 Email: support@simryo.com</p>
                <p>🌐 Visit: simryo.com/support</p>
                <p>Thank you for choosing SIMRYO!</p>
            </div>
        </div>
    </body>
    </html>
    `

    const emailText = `
✅ ORDER CONFIRMED - SIMRYO

Hi ${customerInfo.name},

Your payment has been processed successfully!

Order Details:
- Order ID: ${paymentIntentId}
- Date: ${new Date().toLocaleString()}
- Total: $${totalAmount.toFixed(2)}

${orderSummary}

📧 eSIM DELIVERY:
Your eSIM will be delivered to this email address within 10-15 minutes.

What you'll receive:
- eSIM QR code
- Activation instructions
- Setup guide

⚠️ IMPORTANT: Check your spam folder if you don't receive the eSIM email.

Need help? Contact support@simryo.com

Thank you for choosing SIMRYO!
    `

    const { data, error } = await resend.emails.send({
      from: 'SIMRYO <orders@simryo.com>',
      to: [customerInfo.email],
      subject: `✅ Order Confirmed - eSIM Delivery in 10-15 minutes`,
      html: emailHtml,
      text: emailText,
    })

    if (error) {
      console.error('Failed to send customer confirmation:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to send customer confirmation' },
        { status: 500 }
      )
    }

    console.log('Customer confirmation sent:', data)

    return NextResponse.json({
      success: true,
      message: 'Customer confirmation sent successfully',
      emailId: data?.id
    })

  } catch (error) {
    console.error('Customer confirmation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send customer confirmation' },
      { status: 500 }
    )
  }
}