import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { RequestHandler } from 'express';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocsModule } from './docs/docs.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(helmet());

  const safeCompression = compression() as unknown as RequestHandler;
  app.use(safeCompression);

  // ── CORS
  // Accept either a comma-separated list in CORS_ORIGINS or "*".
  const rawOrigins = (config.get<string>('app.cors') ?? '').trim();
  const allowAll = rawOrigins === '*' || rawOrigins.toLowerCase() === 'true';

  app.enableCors({
    origin: allowAll
      ? true
      : rawOrigins
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 3600,
  });

  // ── API versioning (must be set before global prefix)
  app.enableVersioning({
    type: VersioningType.URI, // Results in routes like /v1/users
    defaultVersion: '1',
  });

  // // ── API prefix
  // const globalPrefix = config.get<string>('API_PREFIX') ?? 'api';
  // app.setGlobalPrefix(globalPrefix);

  /* Setup Swagger */
  DocsModule.setup(app);

  // ── Health of long-running services
  // Ensure providers can hook into SIGTERM/SIGINT for graceful shutdown.
  app.enableShutdownHooks();
  // ── Start HTTP server
  const port = Number(config.get<number>('PORT') ?? 9000);
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap', { timestamp: true });

  logger.log(
    `Server ready on http://localhost:${port}. NODE_ENV=${config.get(
      'app.env',
    )}`,
  );
}
bootstrap();
