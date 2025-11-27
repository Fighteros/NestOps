# Create Backend - Complete Documentation

## Overview

**Create Backend** is a CLI tool that automatically generates production-ready NestJS backend applications with enterprise-grade configuration, best practices, and essential tools pre-configured. Instead of spending hours setting up logging, validation, error handling, and other infrastructure concerns, you get a fully configured backend in seconds.

## What This Tool Does

When you run `npx create-backend my-app`, the tool:

1. **Creates a complete NestJS project structure** with organized folders and modules
2. **Installs and configures all dependencies** automatically
3. **Sets up enterprise-grade features** like logging, error handling, validation, and security
4. **Generates configuration files** for TypeScript, ESLint, Docker, and more
5. **Provides a ready-to-run application** that follows NestJS best practices

You can start building your business logic immediately without worrying about infrastructure setup.

---

## Auto-Configured Features

### 1. Logging System

**Winston Logger with Daily Rotation**

The generated backend includes a sophisticated logging system:

- **Daily Rotating Log Files:**
  - `logs/YYYY-MM-DD-error.log` - Error-level logs only
  - `logs/YYYY-MM-DD-combined.log` - All logs combined
  - Automatic log rotation every day
  - Automatic archiving (ZIP compression)
  - 30-day retention policy

- **Console Output:**
  - Colorized, formatted output for development
  - Timestamp, context, and log level display
  - Pretty-printed JSON for structured logging

- **Integration:**
  - Replaces NestJS default logger
  - Automatically used throughout the application
  - Context-aware logging (shows which module/class logged the message)

**Usage Example:**
```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Operation started');
    this.logger.error('Something went wrong', error.stack);
  }
}
```

**Configuration:** `src/common/logger/logger.config.ts`

---

### 2. Configuration Management

**Environment-Based Configuration with Validation**

- **Joi Schema Validation:**
  - Validates all environment variables on startup
  - Type-safe configuration access
  - Clear error messages for missing/invalid config

- **Organized Config Structure:**
  - `app.config.ts` - Application settings (name, env, port, CORS)
  - `database.config.ts` - Database connection settings
  - `secrets.config.ts` - Secret keys and sensitive data

- **Type-Safe Access:**
  ```typescript
  // Instead of process.env.PORT
  const port = configService.get<number>('app.port');
  const dbHost = configService.get<string>('database.host');
  ```

**Configuration Files:**
- `src/config/config.module.ts` - Main config module
- `src/config/configs/*.config.ts` - Individual config files
- `.env.example` - Template for environment variables

---

### 3. Database Integration

**TypeORM with PostgreSQL/MySQL Support**

- **Pre-configured Database Module:**
  - Connection pooling (10 connections)
  - Auto-load entities from modules
  - Snake case naming strategy (database-friendly)
  - Connection timeout handling
  - Query execution time monitoring

- **Database Features:**
  - Automatic entity discovery
  - Migration support
  - Subscriber support
  - SSL support for production
  - Development logging enabled

- **Naming Strategy:**
  - Converts camelCase to snake_case automatically
  - Example: `userName` → `user_name` in database

**Usage Example:**
```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string; // Stored as user_name in DB
}
```

**Configuration:** `src/modules/database/database.module.ts`

---

### 4. Global Exception Handling

**Comprehensive Error Handling**

The `GlobalExceptionFilter` automatically handles:

- **HTTP Exceptions:**
  - Standardizes error response format
  - Includes status code, message, timestamp, and path
  - Handles validation errors gracefully

- **Database Errors:**
  - TypeORM query failures
  - Duplicate entry violations (409 Conflict)
  - Database connection errors

- **Error Logging:**
  - All errors logged with full context
  - Stack traces in development mode
  - Sanitized error messages in production

**Error Response Format:**
```json
{
  "code": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/users",
  "method": "POST",
  "message": "Validation failed",
  "details": "email must be an email"
}
```

**Configuration:** `src/core/filters/global-exception.filter.ts`

---

### 5. Request/Response Interceptors

**Automatic Request Processing**

Four interceptors are automatically applied:

#### a) Request ID Interceptor
- Generates unique request ID for each request
- Adds `X-Request-Id` header to responses
- Useful for tracing requests across services

#### b) Response Interceptor
- Standardizes all API responses
- Wraps data in consistent format
- Handles pagination metadata

#### c) Logging Interceptor
- Logs all incoming requests
- Logs response status and timing
- Includes request ID in logs

#### d) Header Validator Interceptor
- Validates required headers
- Ensures API version compatibility
- Rejects malformed requests early

**Configuration:** `src/core/interceptors/`

---

### 6. Validation System

**Automatic Input Validation**

- **Global Validation Pipe:**
  - Automatically validates all DTOs
  - Uses `class-validator` decorators
  - Transforms plain objects to DTO instances
  - Strips unknown properties

- **Validation Decorators:**
  ```typescript
  import { IsEmail, IsString, MinLength } from 'class-validator';

  export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
  }
  ```

- **Error Formatting:**
  - Clear validation error messages
  - Lists all validation failures
  - Returns 400 Bad Request with details

**Configuration:** `src/core/pipes/validation.pipe.ts`

---

### 7. API Documentation (Swagger)

**Auto-Generated OpenAPI Documentation**

- **Automatic Setup:**
  - Swagger UI available at `/api/docs`
  - OpenAPI 3.0 specification
  - Interactive API testing interface

- **Decorators Support:**
  ```typescript
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

  @ApiTags('users')
  @Controller('users')
  export class UsersController {
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created' })
    @Post()
    create(@Body() dto: CreateUserDto) {
      // ...
    }
  }
  ```

- **Features:**
  - Request/response schemas
  - Authentication documentation
  - Example values
  - Try-it-out functionality

**Configuration:** `src/docs/docs.module.ts`

---

### 8. Security Features

**Multiple Security Layers**

#### a) Helmet
- Sets secure HTTP headers
- Prevents XSS attacks
- Content Security Policy
- Hides server information

#### b) CORS
- Configurable allowed origins
- Credentials support
- Preflight request handling
- Configurable via environment variables

#### c) Rate Limiting (Throttler)
- 120 requests per 60 seconds (default)
- Prevents abuse and DDoS
- Configurable per endpoint
- Returns 429 Too Many Requests

#### d) Request Compression
- Gzip compression for responses
- Reduces bandwidth usage
- Improves response times

**Configuration:**
- Security: `src/main.ts`
- Rate Limiting: `src/app.module.ts` (ThrottlerModule)

---

### 9. Internationalization (i18n)

**Multi-Language Support**

- **Pre-configured:**
  - English as fallback language
  - Accept-Language header resolver
  - Translation file structure
  - Hot-reload in development

- **Usage:**
  ```typescript
  import { I18nService } from 'nestjs-i18n';

  constructor(private i18n: I18nService) {}

  getMessage() {
    return this.i18n.translate('common.welcome');
  }
  ```

- **Translation Files:**
  - `src/i18n/en/common.json`
  - Easy to add more languages

**Configuration:** `src/app.module.ts` (I18nModule)

---

### 10. Request Context

**Request-Scoped Context Management**

- **Request Context Module:**
  - Stores request-specific data
  - Accessible throughout the request lifecycle
  - Useful for user information, request metadata

- **Usage:**
  ```typescript
  import { RequestContextService } from './core/context/request-context.service';

  constructor(private context: RequestContextService) {
    const userId = this.context.getUserId();
  }
  ```

**Configuration:** `src/core/context/request-context.module.ts`

---

### 11. API Versioning

**URI-Based Versioning**

- Routes automatically prefixed with version
- Example: `/v1/users`, `/v2/users`
- Default version: `v1`
- Configurable per route

**Usage:**
```typescript
@Controller({ path: 'users', version: '1' })
export class UsersV1Controller { }

@Controller({ path: 'users', version: '2' })
export class UsersV2Controller { }
```

**Configuration:** `src/main.ts`

---

### 12. Static File Serving

**File Upload Support**

- Pre-configured static file serving
- Serves files from `uploads/` directory
- Accessible at `/uploads/*`
- Useful for user-uploaded content

**Configuration:** `src/app.module.ts` (ServeStaticModule)

---

## Project Structure

```
my-app/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── dto/            # Common DTOs (GenericResponseDto)
│   │   ├── entities/       # Base entities
│   │   ├── interfaces/     # Shared interfaces
│   │   └── logger/         # Winston logger configuration
│   ├── config/             # Configuration management
│   │   ├── config.module.ts
│   │   └── configs/        # Individual config files
│   ├── core/               # Core application logic
│   │   ├── context/        # Request context
│   │   ├── filters/        # Exception filters
│   │   ├── interceptors/   # Request/response interceptors
│   │   └── pipes/          # Validation pipes
│   ├── docs/               # Swagger documentation
│   ├── i18n/               # Translation files
│   ├── modules/            # Feature modules
│   │   └── database/       # Database module
│   ├── app.module.ts       # Root module
│   └── main.ts             # Application entry point
├── test/                    # E2E tests
├── logs/                    # Generated log files
├── .env.example            # Environment variables template
├── docker-compose.yml      # Docker setup
├── Dockerfile              # Container configuration
├── tsconfig.json           # TypeScript config
├── nest-cli.json           # NestJS CLI config
└── package.json            # Dependencies
```

---

## Environment Variables

The generated application uses these environment variables (see `.env.example`):

```env
# Application
APP_NAME=my-app
NODE_ENV=development
PORT=9000
CORS_ORIGINS=*

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
DATABASE_NAME=my-app_db

# Secrets
UPLOAD_SECRET=your-secret-key-here
```

---

## Getting Started After Generation

1. **Navigate to your app:**
   ```bash
   cd my-app
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run start:dev
   ```

4. **Access your API:**
   - API: http://localhost:9000
   - Swagger Docs: http://localhost:9000/api/docs

---

## Available Scripts

- `npm run build` - Build the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:prod` - Start in production mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Lint the code
- `npm run format` - Format code with Prettier

---

## Why Use This Tool?

### Time Savings
Instead of spending hours or days setting up:
- Logging infrastructure
- Error handling
- Validation
- Security headers
- Database configuration
- API documentation

You get all of this **automatically configured** in seconds.

### Best Practices
The generated code follows:
- NestJS best practices
- TypeScript strict mode
- SOLID principles
- Enterprise patterns
- Security best practices

### Production-Ready
The generated backend is:
- ✅ Secure by default
- ✅ Well-structured
- ✅ Fully typed
- ✅ Testable
- ✅ Scalable
- ✅ Maintainable

### Consistency
All projects generated with this tool have:
- Consistent structure
- Same configuration patterns
- Unified error handling
- Standardized logging

---

## Requirements

- **Node.js** >= 22.0.0
- **npm** >= 10.0.0

---

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/fighteros/NestOps).

---

## License

MIT License - Copyright (c) 2024 Ahmed Abd ElGhany

See [LICENSE](./LICENSE) file for details.

