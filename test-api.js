// Test the plans API endpoint
async function testPlansAPI() {
  console.log('🔍 Testing Plans API endpoint...');
  
  try {
    const response = await fetch('http://localhost:3001/api/plans', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ API Error:', error);
      return;
    }

    const data = await response.json();
    console.log('✅ API Response received');
    console.log('📦 Success:', data.success);
    console.log('🎯 Total plans:', data.plans ? data.plans.length : 0);
    
    if (data.plans && data.plans.length > 0) {
      console.log('\n📱 Sample plans from API:');
      data.plans.slice(0, 3).forEach((plan, index) => {
        console.log(`${index + 1}. ${plan.country} - ${plan.data} for ${plan.days} days`);
        console.log(`   Price: $${plan.price} ${plan.currency}`);
        console.log(`   Provider: ${plan.providerDisplayName}`);
        console.log(`   ID: ${plan.id}`);
        console.log('');
      });
    } else {
      console.log('⚠️ No plans found');
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testPlansAPI();