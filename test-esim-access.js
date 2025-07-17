// Test script to verify eSIM Access API connection
const apiKey = 'cfd3a757a99d4795a5ff3b1714eae3e6';
const baseUrl = 'https://api.esimaccess.com/api/v1';

async function testEsimAccessAPI() {
  console.log('🔍 Testing eSIM Access API connection...');
  
  try {
    const headers = {
      'RT-AccessCode': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const requestBody = {
      locationCode: "",
      type: "",
      slug: "",
      packageCode: "",
      iccid: ""
    };

    console.log('📡 Making API request to:', `${baseUrl}/open/package/list`);
    console.log('🔑 Using API key:', apiKey.substring(0, 8) + '...');

    const response = await fetch(`${baseUrl}/open/package/list`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      timeout: 20000
    });

    console.log('📊 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ API Response received');
    console.log('📦 Success:', data.success);
    
    if (data.success && data.obj && data.obj.packageList) {
      console.log('🎯 Total plans available:', data.obj.packageList.length);
      
      // Show first 3 plans as examples
      const samplePlans = data.obj.packageList.slice(0, 3);
      console.log('\n📱 Sample plans:');
      samplePlans.forEach((plan, index) => {
        console.log(`${index + 1}. ${plan.name || 'Unknown'} - ${plan.packageCode}`);
        console.log(`   Price: ${plan.retailPrice / 10000 || 'Unknown'} USD`);
        console.log(`   Data: ${plan.volume ? Math.round(plan.volume / 1024 / 1024) + 'MB' : 'Unknown'}`);
        console.log(`   Duration: ${plan.duration || 'Unknown'} days`);
        console.log('');
      });
    } else {
      console.log('⚠️ No plans found or API error');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testEsimAccessAPI();