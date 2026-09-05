import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify'; // 1. Impor tipe FastifyRequest
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const url = request?.url ?? '';

    const timeoutDuration = url.includes('/ai/') ? 60000 : 10000;

    return next.handle().pipe(
      timeout(timeoutDuration),
      catchError((err: unknown) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                `Request Timeout (Exceeded ${timeoutDuration / 1000}s)`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
