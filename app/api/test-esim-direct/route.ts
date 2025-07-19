import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.ESIM_ACCESS_API_KEY
    const baseUrl = process.env.ESIM_ACCESS_BASE_URL
    
    if (!apiKey || !baseUrl) {
      return NextResponse.json({
        error: 'Missing API configuration',
        hasApiKey: !!apiKey,
        hasBaseUrl: !!baseUrl
      }, { status: 500 })
    }

    // Test 1: Try to reach the balance endpoint
    console.log('Testing eSIM Access API connectivity...')
    console.log('Base URL:', baseUrl)
    console.log('API Key (first 8 chars):', apiKey.substring(0, 8) + '...')

    const testUrls = [
      `${baseUrl}/exec`,
      `${baseUrl}/exec?action=balance`,
      `https://api.esimaccess.com/exec`,
      `https://api.esimaccess.com/exec?action=balance`,
      `https://api.esimaccess.com/exec?slug=CKH491&qty=1`
    ]

    const results = []

    for (const url of testUrls) {
      try {
        console.log('Testing URL:', url)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'RT-AccessCode': apiKey,
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(10000)
        })

        const responseText = await response.text()
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch {
          responseData = responseText
        }

        results.push({
          url,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: responseData,
          success: response.ok
        })

        console.log(`${url} -> ${response.status}`)
      } catch (error) {
        results.push({
          url,
          error: error instanceof Error ? error.message : String(error),
          success: false
        })
        console.log(`${url} -> ERROR: ${error}`)
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      config: {
        baseUrl,
        apiKeyLength: apiKey.length,
        apiKeyPrefix: apiKey.substring(0, 8) + '...'
      },
      tests: results
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}