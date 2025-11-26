import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging interceptor for request/response logging
 * Logs all incoming requests and their response times
 *
 * Benefits:
 * - Track API usage and performance
 * - Debug issues with timing information
 * - Audit trail for security
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url} - ${ip} - ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;

          this.logger.log(
            `← ${method} ${url} - Status: ${statusCode} - ${responseTime}ms`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            `← ${method} ${url} - Error: ${error.message} - ${responseTime}ms`,
          );
        },
      }),
    );
  }
}
