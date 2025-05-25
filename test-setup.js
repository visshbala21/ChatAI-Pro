#!/usr/bin/env node

/**
 * ChatAI Pro Setup Verification Script
 * This script checks if the basic setup is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ChatAI Pro Setup Verification\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  '.env.example',
  'next.config.mjs',
  'tailwind.config.ts',
  'tsconfig.json',
  'drizzle.config.ts',
  'lib/db/schema.ts',
  'lib/auth.ts',
  'app/layout.tsx',
  'components/providers.tsx'
];

console.log('📁 Checking required files...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['dev', 'build', 'start', 'db:generate', 'db:migrate'];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ ${script} - MISSING`);
  }
});

// Check environment file
console.log('\n🔐 Checking environment configuration...');
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local exists');
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} is configured`);
    } else {
      console.log(`⚠️  ${envVar} - NOT FOUND (may need to be added)`);
    }
  });
} else {
  console.log('⚠️  .env.local not found - copy from .env.example');
}

// Check node_modules
console.log('\n📚 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules directory exists');
  
  // Check for key dependencies
  const keyDeps = ['next', 'react', 'drizzle-orm', 'next-auth'];
  keyDeps.forEach(dep => {
    if (fs.existsSync(`node_modules/${dep}`)) {
      console.log(`✅ ${dep} installed`);
    } else {
      console.log(`❌ ${dep} - NOT INSTALLED`);
    }
  });
} else {
  console.log('❌ node_modules not found - run npm install');
}

// Summary
console.log('\n📊 Setup Summary:');
if (missingFiles.length === 0) {
  console.log('✅ All required files are present');
} else {
  console.log(`❌ Missing ${missingFiles.length} required files`);
}

console.log('\n🚀 Next Steps:');
console.log('1. Ensure PostgreSQL is running');
console.log('2. Copy .env.example to .env.local and configure');
console.log('3. Run: npm run db:generate');
console.log('4. Run: npm run db:migrate');
console.log('5. Run: npm run dev');
console.log('\n📖 See SETUP_GUIDE.md for detailed instructions'); 