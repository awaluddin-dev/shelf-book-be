import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { Observable, of } from 'rxjs';

@Injectable()
export class DemoModeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest & { user?: any }>();
    const method = request.method;

    // Hanya hadang request mutasi (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const referer = request.headers.referer || '';
      const isFromScalar = referer.includes('/reference');

      if (isFromScalar) {
        return of({
          status: 'success',
          message:
            'Demo Mode: Action simulated successfully. No data was modified in production.',
        });
      }
    }

    return next.handle();
  }
}
