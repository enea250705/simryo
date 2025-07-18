#!/usr/bin/env node

/**
 * Test eSIM Access API Configuration
 * This script helps debug eSIM Access API issues
 */

const fetch = require('node-fetch');

// Configuration
const config = {
  apiKey: process.env.ESIM_ACCESS_API_KEY,
  baseUrl: process.env.ESIM_ACCESS_BASE_URL || 'https://api.esimaccess.com',
  enabled: process.env.ESIM_ACCESS_ENABLED === 'true'
};

console.log('🔍 eSIM Access API Configuration Test');
console.log('=====================================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log(`API Key: ${config.apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`Base URL: ${config.baseUrl}`);
console.log(`Enabled: ${config.enabled}`);

if (!config.apiKey || config.apiKey === 'your-esim-access-api-key') {
  console.log('\n❌ ERROR: Invalid API key configuration');
  console.log('Please set ESIM_ACCESS_API_KEY in your .env.local file');
  process.exit(1);
}

if (!config.enabled) {
  console.log('\n⚠️  WARNING: eSIM Access is disabled');
  console.log('Set ESIM_ACCESS_ENABLED=true to enable');
}

// Test API connectivity
async function testAPI() {
  console.log('\n🌐 Testing API Connectivity...');
  
  try {
    // Test 1: Check supported regions
    console.log('\n1️⃣ Testing supported regions endpoint...');
    const regionsResponse = await fetch(`${config.baseUrl}/api/v1/open/location/list`, {
      method: 'POST',
      headers: {
        'RT-AccessCode': config.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    console.log(`Status: ${regionsResponse.status} ${regionsResponse.statusText}`);
    
    if (regionsResponse.ok) {
      const regionsData = await regionsResponse.json();
      console.log('✅ Regions API working');
      console.log(`Found ${regionsData.obj?.locationList?.length || 0} supported regions`);
    } else {
      const errorText = await regionsResponse.text();
      console.log('❌ Regions API failed:', errorText);
    }

    // Test 2: Check package list
    console.log('\n2️⃣ Testing package list endpoint...');
    const packagesResponse = await fetch(`${config.baseUrl}/open/package/list`, {
      method: 'POST',
      headers: {
        'RT-AccessCode': config.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        locationCode: "US",
        type: "",
        slug: "",
        packageCode: "",
        iccid: ""
      })
    });

    console.log(`Status: ${packagesResponse.status} ${packagesResponse.statusText}`);
    
    if (packagesResponse.ok) {
      const packagesData = await packagesResponse.json();
      console.log('✅ Packages API working');
      console.log(`Found ${packagesData.obj?.packageList?.length || 0} packages for US`);
    } else {
      const errorText = await packagesResponse.text();
      console.log('❌ Packages API failed:', errorText);
    }

    // Test 3: Check usage query endpoint
    console.log('\n3️⃣ Testing usage query endpoint...');
    const usageResponse = await fetch(`${config.baseUrl}/api/v1/open/esim/usage/query`, {
      method: 'POST',
      headers: {
        'RT-AccessCode': config.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        esimTranNoList: ["TEST123"]
      })
    });

    console.log(`Status: ${usageResponse.status} ${usageResponse.statusText}`);
    
    if (usageResponse.ok) {
      const usageData = await usageResponse.json();
      console.log('✅ Usage API working');
    } else {
      const errorText = await usageResponse.text();
      console.log('❌ Usage API failed (expected for test data):', errorText);
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run tests
testAPI().then(() => {
  console.log('\n✅ API test completed');
  console.log('\n📝 Next steps:');
  console.log('1. Check your API key is valid and active');
  console.log('2. Verify your account has sufficient credits');
  console.log('3. Check if your IP is whitelisted if required');
  console.log('4. Contact eSIM Access support if issues persist');
}).catch(error => {
  console.log('❌ Test failed:', error.message);
  process.exit(1);
}); 