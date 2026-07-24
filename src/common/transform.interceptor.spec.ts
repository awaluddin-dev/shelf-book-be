import { TransformInterceptor } from './transform.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response', (done) => {
    const mockExecutionContext = {} as ExecutionContext;
    const mockCallHandler = {
      handle: () => of({ test: 'data' }),
    } as CallHandler;

    const dateSpy = jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2026-07-25T00:00:00.000Z');

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((result) => {
        expect(result).toEqual({
          success: true,
          message: 'Request processed successfully',
          data: { test: 'data' },
          timestamp: '2026-07-25T00:00:00.000Z',
        });
        dateSpy.mockRestore();
        done();
      });
  });
});
