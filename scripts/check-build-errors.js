#!/usr/bin/env node

/**
 * SIMRYO Build Error Checker
 * This script checks for common issues that cause build failures
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SIMRYO Build Error Checker');
console.log('==============================\n');

let hasErrors = false;
let errorCount = 0;
let warningCount = 0;

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function logError(message) {
  console.log(`${colors.red}❌ ERROR:${colors.reset} ${message}`);
  hasErrors = true;
  errorCount++;
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  WARNING:${colors.reset} ${message}`);
  warningCount++;
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Check 1: Environment Variables
console.log(`${colors.bold}1. Environment Variables Check${colors.reset}`);
console.log('----------------------------------------');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  logError('.env file not found! Create one from env.example');
} else {
  logSuccess('.env file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  ];
  
  const optionalVars = [
    'STRIPE_WEBHOOK_SECRET',
    'RESEND_API_KEY',
    'ESIM_ACCESS_API_KEY',
    'ESIM_ACCESS_API_SECRET'
  ];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      logError(`Missing required environment variable: ${varName}`);
    } else {
      logSuccess(`${varName} is configured`);
    }
  });
  
  optionalVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      logWarning(`Missing optional environment variable: ${varName}`);
    } else {
      logSuccess(`${varName} is configured`);
    }
  });
}

// Check 2: Package Dependencies
console.log(`\n${colors.bold}2. Package Dependencies Check${colors.reset}`);
console.log('----------------------------------------');

const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    '@prisma/client',
    'stripe',
    'next-auth'
  ];
  
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      logError(`Missing required dependency: ${dep}`);
    } else {
      logSuccess(`${dep} is installed`);
    }
  });
} else {
  logError('package.json not found!');
}

// Check 3: Database Schema
console.log(`\n${colors.bold}3. Database Schema Check${colors.reset}`);
console.log('----------------------------------------');

const prismaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (fs.existsSync(prismaPath)) {
  logSuccess('Prisma schema exists');
  
  const schemaContent = fs.readFileSync(prismaPath, 'utf8');
  
  // Check for common schema issues
  if (!schemaContent.includes('generator client')) {
    logError('Missing Prisma client generator in schema');
  }
  
  if (!schemaContent.includes('datasource db')) {
    logError('Missing database datasource in schema');
  }
  
  // Check for required models
  const requiredModels = ['User', 'Order', 'Plan'];
  requiredModels.forEach(model => {
    if (!schemaContent.includes(`model ${model}`)) {
      logError(`Missing required model: ${model}`);
    } else {
      logSuccess(`Model ${model} exists`);
    }
  });
} else {
  logError('Prisma schema not found!');
}

// Check 4: API Routes
console.log(`\n${colors.bold}4. API Routes Check${colors.reset}`);
console.log('----------------------------------------');

const apiDir = path.join(process.cwd(), 'app', 'api');
if (fs.existsSync(apiDir)) {
  logSuccess('API directory exists');
  
  const requiredRoutes = [
    'auth/[...nextauth]/route.ts',
    'stripe-webhook/route.ts',
    'plans/route.ts',
    'purchase/route.ts'
  ];
  
  requiredRoutes.forEach(route => {
    const routePath = path.join(apiDir, route);
    if (!fs.existsSync(routePath)) {
      logError(`Missing required API route: ${route}`);
    } else {
      logSuccess(`API route exists: ${route}`);
    }
  });
} else {
  logError('API directory not found!');
}

// Check 5: Import Issues
console.log(`\n${colors.bold}5. Import Path Check${colors.reset}`);
console.log('----------------------------------------');

const libDir = path.join(process.cwd(), 'lib');
if (fs.existsSync(libDir)) {
  logSuccess('lib directory exists');
  
  const requiredLibFiles = [
    'db.ts',
    'auth.ts',
    'utils.ts'
  ];
  
  requiredLibFiles.forEach(file => {
    const filePath = path.join(libDir, file);
    if (!fs.existsSync(filePath)) {
      logError(`Missing required lib file: ${file}`);
    } else {
      logSuccess(`Lib file exists: ${file}`);
    }
  });
} else {
  logError('lib directory not found!');
}

// Check 6: Next.js Configuration
console.log(`\n${colors.bold}6. Next.js Configuration Check${colors.reset}`);
console.log('----------------------------------------');

const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
  logSuccess('Next.js config exists');
  
  const configContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Check for common config issues
  if (configContent.includes('experimental')) {
    logWarning('Experimental features enabled - may cause issues');
  }
  
  if (!configContent.includes('output')) {
    logInfo('No output configuration found (using default)');
  }
} else {
  logError('Next.js config not found!');
}

// Check 7: TypeScript Configuration
console.log(`\n${colors.bold}7. TypeScript Configuration Check${colors.reset}`);
console.log('----------------------------------------');

const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
if (fs.existsSync(tsConfigPath)) {
  logSuccess('TypeScript config exists');
  
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
  
  if (!tsConfig.compilerOptions) {
    logError('Missing compilerOptions in tsconfig.json');
  } else {
    logSuccess('TypeScript compiler options configured');
  }
} else {
  logError('TypeScript config not found!');
}

// Check 8: Common Build Issues
console.log(`\n${colors.bold}8. Common Build Issues Check${colors.reset}`);
console.log('----------------------------------------');

// Check for Resend API issues
const sendEmailPath = path.join(process.cwd(), 'app', 'api', 'send-esim-email', 'route.ts');
if (fs.existsSync(sendEmailPath)) {
  const emailContent = fs.readFileSync(sendEmailPath, 'utf8');
  
  if (emailContent.includes('new Resend(process.env.RESEND_API_KEY)') && 
      !emailContent.includes('process.env.RESEND_API_KEY ?')) {
    logError('Resend constructor called without API key check - will cause build failure');
  } else {
    logSuccess('Resend API properly configured');
  }
}

// Check for missing components
const componentsDir = path.join(process.cwd(), 'components');
if (fs.existsSync(componentsDir)) {
  const requiredComponents = [
    'navbar.tsx',
    'footer.tsx',
    'ui/button.tsx'
  ];
  
  requiredComponents.forEach(component => {
    const componentPath = path.join(componentsDir, component);
    if (!fs.existsSync(componentPath)) {
      logError(`Missing required component: ${component}`);
    } else {
      logSuccess(`Component exists: ${component}`);
    }
  });
}

// Check 9: File Size Issues
console.log(`\n${colors.bold}9. File Size Check${colors.reset}`);
console.log('----------------------------------------');

function checkFileSize(filePath, maxSizeMB = 1) {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeMB = stats.size / (1024 * 1024);
    
    if (sizeMB > maxSizeMB) {
      logWarning(`Large file detected: ${filePath} (${sizeMB.toFixed(2)}MB)`);
    } else {
      logSuccess(`File size OK: ${path.basename(filePath)}`);
    }
  }
}

// Check large files
const largeFiles = [
  'package-lock.json',
  'pnpm-lock.yaml',
  'next-env.d.ts'
];

largeFiles.forEach(file => {
  checkFileSize(path.join(process.cwd(), file), 5);
});

// Check 10: Build Script
console.log(`\n${colors.bold}10. Build Script Check${colors.reset}`);
console.log('----------------------------------------');

if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (!packageJson.scripts || !packageJson.scripts.build) {
    logError('Missing build script in package.json');
  } else {
    logSuccess('Build script configured');
  }
  
  if (!packageJson.scripts || !packageJson.scripts.dev) {
    logWarning('Missing dev script in package.json');
  } else {
    logSuccess('Dev script configured');
  }
}

// Summary
console.log(`\n${colors.bold}📊 SUMMARY${colors.reset}`);
console.log('==========');

if (hasErrors) {
  console.log(`${colors.red}❌ Build will likely fail!${colors.reset}`);
  console.log(`${colors.red}Found ${errorCount} errors and ${warningCount} warnings${colors.reset}`);
  console.log('\n🔧 To fix these issues:');
  console.log('1. Create/update .env file with required variables');
  console.log('2. Install missing dependencies: npm install');
  console.log('3. Generate Prisma client: npx prisma generate');
  console.log('4. Run database migrations: npx prisma migrate deploy');
  console.log('5. Fix import paths and component issues');
} else {
  console.log(`${colors.green}✅ Build should succeed!${colors.reset}`);
  console.log(`${colors.green}Found ${warningCount} warnings (non-critical)${colors.reset}`);
}

console.log(`\n${colors.blue}💡 Next Steps:${colors.reset}`);
console.log('1. Run: npm install');
console.log('2. Run: npx prisma generate');
console.log('3. Run: npm run build');
console.log('4. Deploy to Vercel');

if (hasErrors) {
  process.exit(1);
} else {
  process.exit(0);
} 