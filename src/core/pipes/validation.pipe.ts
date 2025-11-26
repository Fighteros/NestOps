import {
  BadRequestException,
  Injectable,
  ValidationPipe as NestValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = this.buildErrorMessages(errors);
        return new BadRequestException({
          message: 'Validation failed',
          details: messages,
        });
      },
    });
  }

  private buildErrorMessages(errors: ValidationError[]) {
    return errors.map((error) => ({
      field: error.property,
      value: error.value as unknown,
      constraints: this.translateConstraints(error),
      // children: error.children,
    }));
  }

  private translateConstraints(error: ValidationError): Record<string, string> {
    const constraints = error.constraints;

    if (!constraints) return {};

    const translated: Record<string, string> = {};
    for (const [key, message] of Object.entries(constraints)) {
      // Format: "property.constraint"
      const i18nKey = `dto.${error.property}.${key}`;
      translated[key] = this.i18n.t(i18nKey, {
        defaultValue: message,
      });
    }
    return translated;
  }
}
