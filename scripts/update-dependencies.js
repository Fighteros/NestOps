#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');

console.log('🔄 Updating dependencies across all services...\n');

// Base dependencies template (latest versions will be fetched)
const baseDependencies = {
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
  mysql2: '^3.15.3',
  'nest-winston': '^1.10.2',
  'nestjs-i18n': '^10.5.1',
  pg: '^8.16.3',
  'reflect-metadata': '^0.2.2',
  rxjs: '^7.8.1',
  typeorm: '^0.3.27',
  winston: '^3.18.3',
  'winston-daily-rotate-file': '^5.0.0',
};

const baseDevDependencies = {
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
};

// Function to get latest versions using npm view
function getLatestVersion(packageName) {
  try {
    const result = execSync(`npm view ${packageName} version`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return result.trim();
  } catch (error) {
    console.warn(`⚠️  Could not fetch version for ${packageName}, using current`);
    return null;
  }
}

// Update dependencies in a service
function updateServiceDependencies(serviceDir) {
  const packageJsonPath = path.join(serviceDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const serviceName = path.basename(serviceDir);
  console.log(`📦 Updating dependencies for: ${serviceName}`);

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Update dependencies
  if (packageJson.dependencies) {
    Object.keys(baseDependencies).forEach((dep) => {
      if (packageJson.dependencies[dep]) {
        const latestVersion = getLatestVersion(dep);
        if (latestVersion) {
          packageJson.dependencies[dep] = `^${latestVersion}`;
        } else {
          packageJson.dependencies[dep] = baseDependencies[dep];
        }
      }
    });
  }

  // Update devDependencies
  if (packageJson.devDependencies) {
    Object.keys(baseDevDependencies).forEach((dep) => {
      if (packageJson.devDependencies[dep]) {
        const latestVersion = getLatestVersion(dep);
        if (latestVersion) {
          packageJson.devDependencies[dep] = `^${latestVersion}`;
        } else {
          packageJson.devDependencies[dep] = baseDevDependencies[dep];
        }
      }
    });
  }

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );
}

// Main execution
if (!fs.existsSync(appsDir)) {
  console.log('⚠️  No apps directory found. Creating...');
  fs.mkdirSync(appsDir, { recursive: true });
  console.log('✅ Apps directory created. Run create-backend to add services.');
  process.exit(0);
}

const services = fs
  .readdirSync(appsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => path.join(appsDir, dirent.name));

if (services.length === 0) {
  console.log('⚠️  No services found in apps directory.');
  console.log('💡 Run: npm run create-backend <service-name>');
  process.exit(0);
}

services.forEach((serviceDir) => {
  updateServiceDependencies(serviceDir);
});

console.log('\n✅ Dependencies updated in package.json files!');
console.log('📦 Installing updated dependencies...\n');

// Install dependencies from root (workspaces will handle it)
try {
  console.log('Running npm install from root...');
  execSync('npm install', {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('\n✅ All dependencies installed successfully!');
} catch (error) {
  console.error('\n❌ Error installing dependencies:', error.message);
  console.log('💡 Try running "npm install" manually from the root directory.');
  process.exit(1);
}

