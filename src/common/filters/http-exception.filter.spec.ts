import { AllExceptionsFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockLoggerError: jest.SpyInstance;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    mockLoggerError = jest
      .spyOn(filter['logger'], 'error')
      .mockImplementation();
  });

  afterEach(() => {
    mockLoggerError.mockRestore();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockRequest = { url: '/test-url' };
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('Test Error', HttpStatus.BAD_REQUEST);

    // Mock Date for predictable timestamp
    const dateSpy = jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2026-07-25T00:00:00.000Z');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: '2026-07-25T00:00:00.000Z',
      path: '/test-url',
      message: 'Test Error',
    });
    expect(mockLoggerError).toHaveBeenCalledWith(
      `Http Status: ${HttpStatus.BAD_REQUEST} Error Message: "Test Error"`,
    );

    dateSpy.mockRestore();
  });

  it('should handle HttpException with object response', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockRequest = { url: '/test-url' };
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    const exception = new HttpException(
      { message: 'Custom Object Error' },
      HttpStatus.BAD_REQUEST,
    );

    // Mock Date for predictable timestamp
    const dateSpy = jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2026-07-25T00:00:00.000Z');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: '2026-07-25T00:00:00.000Z',
      path: '/test-url',
      message: 'Custom Object Error',
    });

    dateSpy.mockRestore();
  });

  it('should handle generic exceptions', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockRequest = { url: '/test-url' };
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    const exception = new Error('Unexpected error');

    const dateSpy = jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2026-07-25T00:00:00.000Z');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.send).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: '2026-07-25T00:00:00.000Z',
      path: '/test-url',
      message: 'Internal server error',
    });
    expect(mockLoggerError).toHaveBeenCalledWith(
      `Http Status: ${HttpStatus.INTERNAL_SERVER_ERROR} Error Message: "Internal server error"`,
    );

    dateSpy.mockRestore();
  });
});
