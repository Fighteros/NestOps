import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: string | undefined | null = null;

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Detect Multer unexpected field error
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse &&
        typeof (exceptionResponse as { message: unknown }).message ===
          'string' &&
        (exceptionResponse as { message: string }).message.includes(
          'Unexpected field',
        )
      ) {
        status = HttpStatus.CONFLICT;
        message = exceptionResponse.message as string;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as Record<string, unknown>;
        message =
          typeof resp.message === 'string' ? resp.message : exception.message;
        details = resp.details as string | undefined | null;
      } else {
        message = exceptionResponse as string;
      }
    }
    // Handle TypeORM query errors +  duplicate entry
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database query failed';
      details =
        process.env.NODE_ENV === 'development' ? exception.message : null;
      const driverError = (exception as QueryFailedError).driverError;
      if ((driverError as any).code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry violates unique constraint';
        details = (driverError as any).detail;
      }
    }

    // Handle other errors
    else if (exception instanceof Error) {
      message = exception.message;
      details = process.env.NODE_ENV === 'development' ? exception.stack : null;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status}`,
      exception instanceof Error ? exception.stack : exception,
    );

    // Send response
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(details && { details }),
    });
  }
}
