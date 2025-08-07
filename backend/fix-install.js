const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing backend dependencies...');

// Critical dependencies for backend
const dependencies = [
  'dotenv',
  'mongoose',
  'express',
  'bcryptjs',
  'jsonwebtoken',
  'cors',
  'helmet',
  'winston',
  'nodemailer',
  'multer',
  'axios',
  'moment',
  'celebrate',
  'joi'
];

console.log('📦 Installing critical dependencies one by one...');

for (const dep of dependencies) {
  try {
    console.log(`Installing ${dep}...`);
    execSync(`npm install ${dep} --no-save --legacy-peer-deps`, {
      cwd: __dirname,
      stdio: 'inherit',
      timeout: 60000
    });
    console.log(`✅ ${dep} installed`);
  } catch (error) {
    console.error(`❌ Failed to install ${dep}: ${error.message}`);
  }
}

console.log('✨ Installation attempt complete!');