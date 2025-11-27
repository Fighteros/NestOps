# Presigned URLs Service

A NestJS-based service for managing file uploads using presigned URLs.

## Description

This project provides a backend service for handling file uploads securely. It uses NestJS as the framework and supports database interactions, logging, and configuration management.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v22 or later recommended)
- [Docker](https://www.docker.com/) (for running the database)
- [npm](https://www.npmjs.com/)

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd presigned-urls
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Copy the example environment file to `.env`:

    ```bash
    cp .env.example .env
    ```

2.  Update the `.env` file with your specific configuration values. See `.env.example` for the required variables.

    **Environment Variables:**
    - **Application:**
      - `APP_NAME`: Name of the application (default: `presigned-urls`)
      - `NODE_ENV`: Environment (development, production, etc.)
      - `PORT`: Port to run the application on (default: `8000`)
      - `CORS_ORIGINS`: Allowed CORS origins

    - **Database:**
      - `DATABASE_HOST`: Database host
      - `DATABASE_PORT`: Database port
      - `DATABASE_USERNAME`: Database username
      - `DATABASE_PASSWORD`: Database password
      - `DATABASE_NAME`: Database name

    - **Secrets:**
      - `UPLOAD_SECRET`: Secret key for upload operations

## Running the Application

### Development

To start the application in development mode with watch mode enabled:

```bash
npm run start:dev
```

### Production

To build and start the application in production mode:

```bash
npm run build
npm run start:prod
```

## Testing

To run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

The project follows a modular structure:

- `src/`: Source code
  - `common/`: Shared utilities, filters, interceptors, and logger
  - `config/`: Configuration files and validation schemas
  - `core/`: Core application logic
  - `modules/`: Feature modules (e.g., `uploads`, `database`)
  - `main.ts`: Application entry point

## License

[UNLICENSED](LICENSE)
