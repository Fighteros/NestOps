import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import { GenericResponseDto } from '@/common/dto/generic.response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();

    const language = request.header('accept-language') || 'en';
    response.header('X-Powered-By', 'Mint-Ops');
    response.header('Content-Language', language);

    return next.handle().pipe(
      map((data: unknown) => {
        const response = new GenericResponseDto();
        response.code = context
          .switchToHttp()
          .getResponse<Response>().statusCode;
        response.response = instanceToPlain(data);
        response.timestamp = new Date().toISOString();
        return response;
      }),
    );
  }
}
