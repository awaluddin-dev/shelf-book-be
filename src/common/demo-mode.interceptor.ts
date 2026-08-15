import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class DemoModeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Hanya hadang request mutasi (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const isDemoMode = process.env.DEMO_MODE === 'true';
      const isAdmin = !!request.user;

      if (isDemoMode || !isAdmin) {
        return of({
          status: 'success',
          message: 'Demo Mode: Action simulated successfully. No data was modified in production.',
        });
      }
    }

    return next.handle();
  }
}
