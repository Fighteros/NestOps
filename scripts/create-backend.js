#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get app name from command line arguments
const appName = process.argv[2];

if (!appName) {
  console.error('❌ Error: App name is required');
  console.log('\nUsage:');
  console.log('  npx create-backend <app-name>');
  console.log('  npm create backend <app-name>');
  console.log('  create-backend <app-name> (if installed globally)');
  console.log('\nExample:');
  console.log('  npx create-backend my-api');
  process.exit(1);
}

// Validate app name (kebab-case)
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(appName)) {
  console.error('❌ Error: App name must be in kebab-case (e.g., my-app)');
  process.exit(1);
}

// Get the template directory
// When installed via npm/npx, __dirname points to node_modules/create-backend/scripts
// When run locally, __dirname points to the repo's scripts directory
let rootDir = path.resolve(__dirname, '..');

// Function to check if a directory is the package root
function isPackageRoot(dir) {
  const packageJson = path.join(dir, 'package.json');
  const srcDir = path.join(dir, 'src');
  return fs.existsSync(packageJson) && fs.existsSync(srcDir);
}

// Try to find the package root
// First, check if current directory is the root
if (!isPackageRoot(rootDir)) {
  // Check if we're in node_modules (installed package)
  // Path structure: node_modules/create-backend/scripts/create-backend.js
  // We need: node_modules/create-backend/
  
  // Try parent directory
  const parentDir = path.resolve(__dirname, '..');
  if (isPackageRoot(parentDir)) {
    rootDir = parentDir;
  } else {
    // Try going up from node_modules (for scoped packages like @scope/create-backend)
    const possibleRoots = [
      path.resolve(__dirname, '..', '..'), // node_modules/@scope/create-backend
      path.resolve(__dirname, '..', '..', '..'), // node_modules/@scope/
    ];
    
    for (const possibleRoot of possibleRoots) {
      if (isPackageRoot(possibleRoot)) {
        rootDir = possibleRoot;
        break;
      }
    }
  }
}

// Verify we found the right directory
if (!isPackageRoot(rootDir)) {
  console.error('❌ Error: Could not find template files');
  console.error(`   Looked in: ${rootDir}`);
  console.error('   Make sure the package is properly installed.');
  process.exit(1);
}

const currentDir = process.cwd();
const targetDir = path.join(currentDir, appName);

// Check if directory already exists
if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Directory "${appName}" already exists`);
  process.exit(1);
}

console.log(`🚀 Creating new backend application: ${appName}...\n`);

// Create target directory
fs.mkdirSync(targetDir, { recursive: true });

// Files and directories to copy from template
const templateFiles = [
  'src',
  'test',
  'tsconfig.json',
  'tsconfig.build.json',
  'nest-cli.json',
  'eslint.config.mjs',
  'Dockerfile',
  'docker-compose.yml',
  '.gitignore',
];

// Copy template files
console.log('📁 Copying template files...');
templateFiles.forEach((item) => {
  const sourcePath = path.join(rootDir, item);
  const destPath = path.join(targetDir, item);

  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️  Warning: ${item} not found, skipping...`);
    return;
  }

  const stat = fs.statSync(sourcePath);
  if (stat.isDirectory()) {
    copyDirectory(sourcePath, destPath);
  } else {
    fs.copyFileSync(sourcePath, destPath);
  }
});

// Create package.json for the new app
console.log('📦 Creating package.json...');
const packageJson = {
  name: appName,
  version: '0.0.1',
  description: `Backend application: ${appName}`,
  author: '',
  private: true,
  license: 'UNLICENSED',
  scripts: {
    build: 'nest build',
    format: 'prettier --write "src/**/*.ts" "test/**/*.ts"',
    start: 'nest start',
    'start:dev': 'nest start --watch',
    'start:debug': 'nest start --debug --watch',
    'start:prod': 'node dist/main',
    lint: 'eslint "{src,apps,libs,test}/**/*.ts" --fix',
    test: 'jest',
    'test:watch': 'jest --watch',
    'test:cov': 'jest --coverage',
    'test:debug':
      'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
    'test:e2e': 'jest --config ./test/jest-e2e.json',
    clean: 'rimraf dist',
  },
  dependencies: {
    '@nestjs/common': '^11.0.1',
    '@nestjs/config': '^4.0.2',
    '@nestjs/core': '^11.0.1',
    '@nestjs/platform-express': '^11.1.9',
    '@nestjs/serve-static': '^5.0.4',
    '@nestjs/swagger': '^11.2.3',
    '@nestjs/throttler': '^6.4.0',
    '@nestjs/typeorm': '^11.0.0',
    'class-transformer': '^0.5.1',
    'class-validator': '^0.14.3',
    compression: '^1.8.1',
    helmet: '^8.1.0',
    joi: '^18.0.2',
    multer: '^2.0.2',
    'mysql2': '^3.15.3',
    'nest-winston': '^1.10.2',
    'nestjs-i18n': '^10.5.1',
    pg: '^8.16.3',
    'reflect-metadata': '^0.2.2',
    rxjs: '^7.8.1',
    typeorm: '^0.3.27',
    winston: '^3.18.3',
    'winston-daily-rotate-file': '^5.0.0',
  },
  devDependencies: {
    '@eslint/eslintrc': '^3.2.0',
    '@eslint/js': '^9.18.0',
    '@nestjs/cli': '^11.0.0',
    '@nestjs/schematics': '^11.0.0',
    '@nestjs/testing': '^11.0.1',
    '@swc/cli': '^0.7.9',
    '@swc/core': '^1.15.3',
    '@types/express': '^5.0.0',
    '@types/jest': '^30.0.0',
    '@types/multer': '^2.0.0',
    '@types/node': '^22.10.7',
    '@types/supertest': '^6.0.2',
    eslint: '^9.18.0',
    'eslint-config-prettier': '^10.0.1',
    'eslint-plugin-prettier': '^5.2.2',
    globals: '^16.0.0',
    jest: '^30.0.0',
    prettier: '^3.4.2',
    'source-map-support': '^0.5.21',
    supertest: '^7.0.0',
    'ts-jest': '^29.2.5',
    'ts-loader': '^9.5.2',
    'ts-node': '^10.9.2',
    'tsconfig-paths': '^4.2.0',
    typescript: '^5.7.3',
    'typescript-eslint': '^8.20.0',
    rimraf: '^6.0.1',
  },
  jest: {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
  },
};

fs.writeFileSync(
  path.join(targetDir, 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
);

// Create .env.example file
console.log('📝 Creating .env.example...');
const envExample = `# Application Configuration
APP_NAME=${appName}
NODE_ENV=development
PORT=9000
CORS_ORIGINS=*

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
DATABASE_NAME=${appName}_db

# Secrets
UPLOAD_SECRET=your-secret-key-here
`;

fs.writeFileSync(path.join(targetDir, '.env.example'), envExample);

// Create README.md for the app
console.log('📖 Creating README.md...');
const readme = `# ${appName}

Backend application generated with create-backend CLI.

## Getting Started

1. Copy the environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run start:dev
   \`\`\`

## Available Scripts

- \`npm run build\` - Build the application
- \`npm run start:dev\` - Start in development mode with watch
- \`npm run start:prod\` - Start in production mode
- \`npm run test\` - Run tests
- \`npm run lint\` - Lint the code

## Project Structure

- \`src/\` - Source code
  - \`common/\` - Shared utilities, DTOs, entities, interfaces
  - \`config/\` - Configuration files and validation schemas
  - \`core/\` - Core application logic (filters, interceptors, pipes)
  - \`modules/\` - Feature modules
  - \`main.ts\` - Application entry point
- \`test/\` - E2E tests
`;

fs.writeFileSync(path.join(targetDir, 'README.md'), readme);

// Update nest-cli.json to use correct sourceRoot
const nestCliPath = path.join(targetDir, 'nest-cli.json');
if (fs.existsSync(nestCliPath)) {
  const nestCli = JSON.parse(fs.readFileSync(nestCliPath, 'utf8'));
  nestCli.sourceRoot = 'src';
  fs.writeFileSync(nestCliPath, JSON.stringify(nestCli, null, 2) + '\n');
}

// Helper function to copy directory recursively
function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

console.log(`\n✅ Application "${appName}" created successfully!`);
console.log(`\n📁 Location: ${targetDir}`);
console.log(`\n📦 Installing dependencies...\n`);

// Install dependencies
try {
  execSync('npm install', {
    cwd: targetDir,
    stdio: 'inherit',
  });
  console.log(`\n✅ Dependencies installed successfully!`);
} catch (error) {
  console.error(`\n⚠️  Warning: Could not install dependencies automatically.`);
  console.log(`💡 Run "npm install" in the project directory.`);
}

console.log(`\n📝 Next steps:`);
console.log(`   1. cd ${appName}`);
console.log(`   2. cp .env.example .env`);
console.log(`   3. npm run start:dev`);
console.log(`\n🎉 Your backend is ready! Happy coding!`);
