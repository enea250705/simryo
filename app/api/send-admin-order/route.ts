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

    // Admin email address - add this to your .env
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@simryo.com'

    // Create order summary
    const orderSummary = orderItems.map((item: any, index: number) => {
      return `
Order ${index + 1}:
- Country: ${item.countryName} ${item.flag}
- Plan: ${item.plan.data} for ${item.plan.days} days
- Network: ${item.plan.network?.type} (${item.plan.network?.carriers?.join(', ')})
- Price: $${item.plan.price}
- Quantity: ${item.quantity}
- Plan ID: ${item.planId}
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
        <title>New eSIM Order - Manual Processing Required</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0066cc; }
            .customer-box { background: #e8f4fd; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .total { font-size: 18px; font-weight: bold; color: #0066cc; }
            .urgent { background: #ffebee; border-left: 4px solid #f44336; padding: 10px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚨 NEW eSIM ORDER - MANUAL PROCESSING REQUIRED</h1>
            </div>
            
            <div class="content">
                <div class="urgent">
                    <strong>⏰ ACTION REQUIRED:</strong> Customer is waiting for eSIM delivery within 10-15 minutes!
                </div>

                <div class="customer-box">
                    <h3>📧 Customer Information:</h3>
                    <p><strong>Name:</strong> ${customerInfo.name}</p>
                    <p><strong>Email:</strong> ${customerInfo.email}</p>
                    <p><strong>Phone:</strong> ${customerInfo.phone || 'Not provided'}</p>
                    <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
                    <p><strong>Order Time:</strong> ${new Date().toLocaleString()}</p>
                </div>

                <h3>📱 Order Details:</h3>
                <div class="order-box">
                    <pre>${orderSummary}</pre>
                </div>

                <p class="total">💰 Total Amount: $${totalAmount.toFixed(2)}</p>

                <div class="urgent">
                    <h4>📋 Next Steps:</h4>
                    <ol>
                        <li>Process the eSIM order with your provider</li>
                        <li>Get the QR code and activation details</li>
                        <li>Send eSIM details to customer email: <strong>${customerInfo.email}</strong></li>
                        <li>Update order status in dashboard</li>
                    </ol>
                </div>

                <p><strong>Customer Message:</strong> "You will receive your eSIM activation details via email within 10-15 minutes."</p>
            </div>
        </div>
    </body>
    </html>
    `

    const emailText = `
NEW eSIM ORDER - MANUAL PROCESSING REQUIRED

Customer: ${customerInfo.name} (${customerInfo.email})
Payment ID: ${paymentIntentId}
Order Time: ${new Date().toLocaleString()}

Order Details:
${orderSummary}

Total: $${totalAmount.toFixed(2)}

ACTION REQUIRED: Process and send eSIM to ${customerInfo.email} within 10-15 minutes.
    `

    const { data, error } = await resend.emails.send({
      from: 'SIMRYO Orders <orders@simryo.com>',
      to: [adminEmail],
      subject: `🚨 URGENT: New eSIM Order - ${customerInfo.name} - $${totalAmount}`,
      html: emailHtml,
      text: emailText,
    })

    if (error) {
      console.error('Failed to send admin notification:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to send admin notification' },
        { status: 500 }
      )
    }

    console.log('Admin notification sent:', data)

    return NextResponse.json({
      success: true,
      message: 'Admin notification sent successfully',
      emailId: data?.id
    })

  } catch (error) {
    console.error('Admin notification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send admin notification' },
      { status: 500 }
    )
  }
}