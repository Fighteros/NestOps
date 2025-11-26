import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  MethodNotAllowedException,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { RequestContextService } from 'src/core/context/request-context.service';

@Injectable()
export class HeaderValidatorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HeaderValidatorInterceptor.name);

  constructor(
    private readonly i18: I18nService,
    private readonly configService: ConfigService,
    private readonly requestContext: RequestContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    let language = request.headers['accept-language'] as string | undefined;
    let timeZone = request.headers['time-zone'] as string | undefined;
    const env = this.configService.get<string>('NODE_ENV');
    const isDevelopment = env === 'development';

    if (!language) {
      if (!isDevelopment) {
        throw new MethodNotAllowedException(
          this.i18.translate('general.incomplete_request', {
            lang: 'en',
          }),
        );
      }
      language = 'en';
      this.logger.warn(
        'Fallback: No language found in request headers, setting default language to en',
      );
    }

    this.logger.log(`Language found in request headers: ${language}`);
    /* Set lang in local storage */
    this.requestContext.set('lang', language);
    this.logger.log(`Language set in language storage: ${language}`);

    if (!timeZone) {
      if (!isDevelopment) {
        throw new MethodNotAllowedException(
          this.i18.translate('general.incomplete_request', {
            lang: language,
          }),
        );
      }
      timeZone = 'Africa/Cairo';
      this.logger.warn(
        'Fallback: No time zone found in request headers, setting default time zone to Africa/Cairo',
      );
    }

    request.headers['time-zone'] = timeZone;
    this.logger.log(`Time zone applied to request headers: ${timeZone}`);

    return next.handle();
  }
}
