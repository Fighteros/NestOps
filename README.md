# Create Backend

A powerful CLI tool to automatically generate production-ready NestJS backend applications with enterprise-grade configuration, best practices, and essential tools pre-configured. Similar to `nest new` or `create-react-app`, but with a complete, battle-tested setup out of the box.

## 🚀 Quick Start

### Using npx (Recommended - No Installation Required)

```bash
npx create-backend my-app
```

Or using npm create:

```bash
npm create backend my-app
```

### Global Installation

```bash
npm install -g create-backend
create-backend my-app
```

### From Git Repository

If you want to use it directly from a git repository without publishing:

```bash
npx github:fighteros/NestOps my-app
```

Or clone and use:

```bash
git clone https://github.com/fighteros/NestOps.git
cd NestOps
npm run create-backend my-app
```

## ✨ What Gets Auto-Generated

This tool automatically creates a **production-ready NestJS backend** with enterprise-grade features pre-configured. No manual setup required!

### 📁 Complete Project Structure

- **`src/common/`** - Shared utilities, DTOs, entities, interfaces, and logger module
- **`src/config/`** - Configuration management with validation schemas (Joi)
- **`src/core/`** - Core application logic:
  - Global exception filters
  - Request/Response interceptors (logging, request ID, header validation)
  - Validation pipes
  - Request context management
- **`src/modules/`** - Feature modules (database module pre-configured)
- **`src/docs/`** - Swagger/OpenAPI documentation setup
- **`src/i18n/`** - Internationalization support
- **`test/`** - E2E test configuration

### 🛠️ Pre-Configured Features

**Core Framework:**
- ✅ NestJS with Express
- ✅ TypeScript with strict mode
- ✅ ESLint + Prettier for code quality

**Database & ORM:**
- ✅ TypeORM with PostgreSQL/MySQL support
- ✅ Snake case naming strategy
- ✅ Auto-load entities
- ✅ Connection pooling configured

**Logging:**
- ✅ Winston logger with daily rotation
- ✅ Separate error and combined log files
- ✅ Console output with colorized formatting
- ✅ Automatic log archiving (30 days retention)

**API Features:**
- ✅ Swagger/OpenAPI documentation (auto-generated)
- ✅ API versioning (URI-based: `/v1/...`)
- ✅ Request ID tracking
- ✅ Response interceptors
- ✅ Request logging

**Security & Performance:**
- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Rate limiting (Throttler)
- ✅ Request compression
- ✅ Global exception handling
- ✅ Input validation (class-validator)

**Developer Experience:**
- ✅ Environment-based configuration
- ✅ i18n support
- ✅ Graceful shutdown hooks
- ✅ Docker & Docker Compose setup
- ✅ E2E testing framework (Jest + Supertest)

For detailed information about all features, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## Getting Started After Creation

1. **Navigate to your new app:**
   ```bash
   cd my-app
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development:**
   ```bash
   npm run start:dev
   ```

4. **Access your API:**
   - API: http://localhost:9000
   - Swagger Docs: http://localhost:9000/api/docs

## Available Scripts

- `npm run build` - Build the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:prod` - Start in production mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Lint the code
- `npm run format` - Format code with Prettier

## 📚 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Comprehensive guide about the tool and all auto-configured features
- **[INSTALL.md](./INSTALL.md)** - Detailed installation and usage instructions
- **[USAGE.md](./USAGE.md)** - Usage guide for different scenarios

## 🔧 Publishing to npm (Optional)

If you want to publish this as an npm package:

1. Update the `repository` field in `package.json` with your git URL
2. Update the `name` field to your desired package name (must be unique on npm)
3. Login to npm: `npm login`
4. Publish: `npm publish`

Then users can install it globally or use via npx.

## Requirements

- Node.js >= 22.0.0
- npm >= 10.0.0

## License

[MIT](LICENSE) - Copyright (c) 2024 Ahmed Abd ElGhany
