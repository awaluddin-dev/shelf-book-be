import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiGlobalResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: ['Validation failed'],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Resource not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests',
      schema: {
        example: {
          statusCode: 429,
          message: 'Too many requests, please try again later.',
          error: 'Too Many Requests',
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      schema: { example: { statusCode: 500, message: 'Internal server error' } },
    }),
  );
}
