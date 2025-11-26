import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { LoggerModule } from './common/logger/logger.module';
import { ConfigModule } from './config/config.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { HeaderValidatorInterceptor } from './core/interceptors/header-validator/header-validator.interceptor';
import { RequestIdInterceptor } from './core/interceptors/request-id/request-id.interceptor';
import { LoggingInterceptor } from './core/interceptors/response/logging.interceptor';
import { RequestContextModule } from './core/context/request-context.module';
import { ResponseInterceptor } from './core/interceptors/response/response.interceptor';
import { ValidationPipe } from './core/pipes/validation.pipe';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DocsModule } from './docs/docs.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
      throwOnMissingKey: false,
      logging: false,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 120,
      },
    ]),

    ConfigModule,
    LoggerModule,
    RequestContextModule,
    DocsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HeaderValidatorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
