#!/usr/bin/env node

/**
 * SIMRYO Build Issue Fixer
 * This script automatically fixes common build issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 SIMRYO Build Issue Fixer');
console.log('============================\n');

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

// Fix 1: Create .env file if missing
console.log(`${colors.bold}1. Environment File Check${colors.reset}`);
console.log('----------------------------------------');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    logSuccess('Created .env file from env.example');
    logWarning('Please update .env with your actual values');
  } else {
    logWarning('.env file missing and no env.example found');
    logInfo('Create .env file manually with required variables');
  }
} else {
  logSuccess('.env file already exists');
}

// Fix 2: Generate Prisma client
console.log(`\n${colors.bold}2. Prisma Client Generation${colors.reset}`);
console.log('----------------------------------------');

const prismaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (fs.existsSync(prismaPath)) {
  logInfo('Prisma schema found - client will be generated during build');
  logInfo('Run: npx prisma generate (if needed)');
} else {
  logWarning('Prisma schema not found');
}

// Fix 3: Check and fix Resend API issues
console.log(`\n${colors.bold}3. Resend API Configuration${colors.reset}`);
console.log('----------------------------------------');

const sendEmailPath = path.join(process.cwd(), 'app', 'api', 'send-esim-email', 'route.ts');
if (fs.existsSync(sendEmailPath)) {
  let emailContent = fs.readFileSync(sendEmailPath, 'utf8');
  
  // Fix Resend constructor issue
  if (emailContent.includes('new Resend(process.env.RESEND_API_KEY)') && 
      !emailContent.includes('process.env.RESEND_API_KEY ?')) {
    
    emailContent = emailContent.replace(
      'const resend = new Resend(process.env.RESEND_API_KEY)',
      '// Initialize Resend only if API key is available\nconst resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null'
    );
    
    // Also fix the usage
    emailContent = emailContent.replace(
      'if (process.env.RESEND_API_KEY) {',
      'if (resend && process.env.RESEND_API_KEY) {'
    );
    
    fs.writeFileSync(sendEmailPath, emailContent);
    logSuccess('Fixed Resend API constructor issue');
  } else {
    logSuccess('Resend API properly configured');
  }
}

// Fix 4: Check package.json scripts
console.log(`\n${colors.bold}4. Package Scripts Check${colors.reset}`);
console.log('----------------------------------------');

const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  let updated = false;
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
    updated = true;
  }
  
  if (!packageJson.scripts.build) {
    packageJson.scripts.build = 'next build';
    updated = true;
  }
  
  if (!packageJson.scripts.dev) {
    packageJson.scripts.dev = 'next dev';
    updated = true;
  }
  
  if (!packageJson.scripts.start) {
    packageJson.scripts.start = 'next start';
    updated = true;
  }
  
  if (!packageJson.scripts.lint) {
    packageJson.scripts.lint = 'next lint';
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    logSuccess('Added missing scripts to package.json');
  } else {
    logSuccess('All required scripts present');
  }
}

// Fix 5: Check TypeScript configuration
console.log(`\n${colors.bold}5. TypeScript Configuration${colors.reset}`);
console.log('----------------------------------------');

const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
if (fs.existsSync(tsConfigPath)) {
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
  let updated = false;
  
  if (!tsConfig.compilerOptions) {
    tsConfig.compilerOptions = {};
    updated = true;
  }
  
  // Ensure essential compiler options
  const essentialOptions = {
    target: 'es5',
    lib: ['dom', 'dom.iterable', 'es6'],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'preserve',
    incremental: true,
    plugins: [
      {
        name: 'next'
      }
    ],
    paths: {
      '@/*': ['./*']
    }
  };
  
  Object.entries(essentialOptions).forEach(([key, value]) => {
    if (!tsConfig.compilerOptions[key]) {
      tsConfig.compilerOptions[key] = value;
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    logSuccess('Updated TypeScript configuration');
  } else {
    logSuccess('TypeScript configuration is complete');
  }
}

// Fix 6: Check Next.js configuration
console.log(`\n${colors.bold}6. Next.js Configuration${colors.reset}`);
console.log('----------------------------------------');

const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
  logSuccess('Next.js config exists');
} else {
  // Create basic Next.js config
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig`;
  
  fs.writeFileSync(nextConfigPath, nextConfig);
  logSuccess('Created basic Next.js configuration');
}

// Fix 7: Check for missing directories
console.log(`\n${colors.bold}7. Directory Structure Check${colors.reset}`);
console.log('----------------------------------------');

const requiredDirs = [
  'app',
  'components',
  'lib',
  'public'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logSuccess(`Created missing directory: ${dir}`);
  } else {
    logSuccess(`Directory exists: ${dir}`);
  }
});

// Summary
console.log(`\n${colors.bold}📊 FIX SUMMARY${colors.reset}`);
console.log('==============');

logSuccess('Build issue fixes completed!');
console.log('\n🔧 Next steps:');
console.log('1. Update .env file with your actual values');
console.log('2. Run: npm install');
console.log('3. Run: npx prisma generate');
console.log('4. Run: npm run build');
console.log('5. Deploy to Vercel');

console.log(`\n${colors.blue}💡 Tips:${colors.reset}`);
console.log('- Make sure all environment variables are set in Vercel');
console.log('- Check that your database is accessible');
console.log('- Verify Stripe keys are correct');
console.log('- Test the build locally before deploying');

logSuccess('Ready to build! 🚀'); 