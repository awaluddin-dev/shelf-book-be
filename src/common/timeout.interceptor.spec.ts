import { TimeoutInterceptor } from './timeout.interceptor';
import {
  CallHandler,
  ExecutionContext,
  RequestTimeoutException,
} from '@nestjs/common';
import { of, throwError, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';

describe('TimeoutInterceptor', () => {
  let interceptor: TimeoutInterceptor;

  beforeEach(() => {
    interceptor = new TimeoutInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should successfully pass data if resolved within timeout', (done) => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/normal-route' }),
      }),
    } as unknown as ExecutionContext;
    const mockCallHandler = {
      handle: () => of('success data'),
    } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (val) => {
        expect(val).toBe('success data');
        done();
      },
    });
  });

  it('should throw RequestTimeoutException if TimeoutError is caught', (done) => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/normal-route' }),
      }),
    } as unknown as ExecutionContext;
    const mockCallHandler = {
      handle: () => throwError(() => new TimeoutError()),
    } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(RequestTimeoutException);
        expect(err.message).toBe('Request Timeout (Exceeded 10s)');
        done();
      },
    });
  });

  it('should rethrow standard errors untouched', (done) => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/normal-route' }),
      }),
    } as unknown as ExecutionContext;
    const standardError = new Error('Standard Error');
    const mockCallHandler = {
      handle: () => throwError(() => standardError),
    } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      error: (err) => {
        expect(err).toBe(standardError);
        done();
      },
    });
  });
});
