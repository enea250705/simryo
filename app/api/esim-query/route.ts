import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderNo, transactionId } = body

    const apiKey = process.env.ESIM_ACCESS_API_KEY
    const baseUrl = process.env.ESIM_ACCESS_BASE_URL

    if (!apiKey || !baseUrl) {
      return NextResponse.json({
        success: false,
        errorCode: '500',
        errorMsg: 'API configuration missing'
      }, { status: 500 })
    }

    console.log('Querying eSIM Access for order:', { orderNo, transactionId })

    const headers = {
      'RT-AccessCode': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    // Query the eSIM Access API for allocated profiles
    const queryPayload = {
      orderNo: orderNo,
      transactionId: transactionId
    }

    const queryResponse = await fetch(`${baseUrl}/open/esim/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(queryPayload),
      signal: AbortSignal.timeout(15000)
    })

    if (!queryResponse.ok) {
      return NextResponse.json({
        success: false,
        errorCode: queryResponse.status.toString(),
        errorMsg: `Query failed: ${queryResponse.statusText}`
      }, { status: queryResponse.status })
    }

    const queryData = await queryResponse.json()
    console.log('eSIM Access query response:', JSON.stringify(queryData, null, 2))

    return NextResponse.json(queryData)

  } catch (error) {
    console.error('eSIM query error:', error)
    return NextResponse.json({
      success: false,
      errorCode: '500',
      errorMsg: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}