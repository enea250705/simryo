#!/usr/bin/env node

/**
 * eSIM Configuration Check Script
 * Helps identify why eSIM purchases are returning mock data
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking eSIM Configuration...');

// Check environment variables
function checkEnvironmentVars() {
  console.log('\n📋 Environment Variables Check:');
  
  const requiredEnvVars = [
    'ESIM_ACCESS_API_KEY',
    'ESIM_ACCESS_BASE_URL',
    'NODE_ENV'
  ];
  
  let allConfigured = true;
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: Not set`);
      allConfigured = false;
    } else if (value.includes('your-') || value.includes('example')) {
      console.log(`⚠️  ${varName}: Contains placeholder value`);
      allConfigured = false;
    } else {
      console.log(`✅ ${varName}: Configured`);
    }
  });
  
  return allConfigured;
}

// Check .env files
function checkEnvFiles() {
  console.log('\n📁 Environment Files Check:');
  
  const envFiles = ['.env', '.env.local', '.env.production'];
  
  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: Found`);
      
      // Check if it contains eSIM Access config
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('ESIM_ACCESS_API_KEY')) {
        console.log(`  📝 Contains eSIM Access configuration`);
      } else {
        console.log(`  ⚠️  Missing eSIM Access configuration`);
      }
    } else {
      console.log(`❌ ${file}: Not found`);
    }
  });
}

// Check provider configuration
function checkProviderConfig() {
  console.log('\n🔧 Provider Configuration Check:');
  
  try {
    const providerFile = 'lib/services/providers/esim-access.ts';
    if (fs.existsSync(providerFile)) {
      console.log(`✅ eSIM Access provider file: Found`);
      
      const content = fs.readFileSync(providerFile, 'utf8');
      
      // Check for mock fallback
      if (content.includes('Return mock success response')) {
        console.log(`⚠️  Mock fallback: Present (this causes mock data in production)`);
      } else {
        console.log(`✅ Mock fallback: Properly configured`);
      }
      
      // Check for API configuration
      if (content.includes('process.env.ESIM_ACCESS_API_KEY')) {
        console.log(`✅ API key usage: Configured`);
      } else {
        console.log(`❌ API key usage: Not found`);
      }
    } else {
      console.log(`❌ eSIM Access provider file: Not found`);
    }
  } catch (error) {
    console.log(`❌ Provider configuration check failed: ${error.message}`);
  }
}

// Check purchase route
function checkPurchaseRoute() {
  console.log('\n🛒 Purchase Route Check:');
  
  try {
    const routeFile = 'app/api/purchase/route.ts';
    if (fs.existsSync(routeFile)) {
      console.log(`✅ Purchase route: Found`);
      
      const content = fs.readFileSync(routeFile, 'utf8');
      
      // Check for proper error handling
      if (content.includes('purchaseResponse.success')) {
        console.log(`✅ Success handling: Configured`);
      } else {
        console.log(`❌ Success handling: Not found`);
      }
      
      // Check for mock detection
      if (content.includes('isMockPurchase')) {
        console.log(`✅ Mock detection: Configured`);
      } else {
        console.log(`❌ Mock detection: Not found`);
      }
    } else {
      console.log(`❌ Purchase route: Not found`);
    }
  } catch (error) {
    console.log(`❌ Purchase route check failed: ${error.message}`);
  }
}

// Provide recommendations
function provideRecommendations() {
  console.log('\n💡 Recommendations:');
  
  const envConfigured = checkEnvironmentVars();
  
  if (!envConfigured) {
    console.log('1. 🔑 CRITICAL: Configure eSIM Access API credentials:');
    console.log('   - Get API key from eSIM Access dashboard');
    console.log('   - Add to .env.local file');
    console.log('   - Set ESIM_ACCESS_API_KEY=your-actual-api-key');
    console.log('   - Set ESIM_ACCESS_BASE_URL=https://api.esimaccess.com/v1');
    console.log('   - Set NODE_ENV=production');
    console.log('');
  }
  
  console.log('2. 🏭 Production Requirements:');
  console.log('   - ALL purchases require real API credentials');
  console.log('   - Failed API calls will fail the purchase');
  console.log('   - No mock data is returned in production');
  console.log('');
  
  console.log('3. 🧪 Test the API:');
  console.log('   - Use the eSIM Access API documentation');
  console.log('   - Test with a small order first');
  console.log('   - Check API response format');
  console.log('   - Monitor server logs for errors');
  console.log('');
  
  console.log('4. 📧 Email configuration:');
  console.log('   - Ensure RESEND_API_KEY is configured');
  console.log('   - Test email sending separately');
  console.log('   - Check spam folder if emails not received');
  console.log('');
}

// Main execution
async function main() {
  checkEnvFiles();
  checkProviderConfig();
  checkPurchaseRoute();
  provideRecommendations();
  
  console.log('\n✅ Configuration check complete!');
  console.log('');
  console.log('🔍 If you\'re still getting mock data:');
  console.log('1. Check your .env.local file has real API credentials');
  console.log('2. Restart your development server');
  console.log('3. Check the server logs for API call errors');
  console.log('4. Verify your eSIM Access account is active');
}

main().catch(console.error);