import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { TransformInterceptor } from './common/transform.interceptor';
import { TimeoutInterceptor } from './common/timeout.interceptor';
import { DemoModeInterceptor } from './common/demo-mode.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  process.env.TZ = 'Asia/Makassar';
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableShutdownHooks();
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "validator.swagger.io"],
        },
      },
    }),
  );
  app.use(compression());
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new TimeoutInterceptor(),
    new DemoModeInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('ShelfBook API')
    .setDescription(
      '# API documentation for the Shelf Book System\n\n' +
      'Welcome to the **ShelfBook API** documentation. \n' +
      'This API is built using **NestJS** and provides all the endpoints needed to interact with the Shelf Book system, including AI integrations, User Authentication, Portfolio management, and more.\n\n' +
      '## Technologies Used\n' +
      '- **Node.js** & **NestJS** (Backend Framework)\n' +
      '- **Fastify** (HTTP engine)\n' +
      '- **PostgreSQL** & **Prisma** (Database & ORM)\n\n' +
      '## Authentication\n' +
      'Most endpoints require a JWT bearer token. Use the `/auth/login` endpoint to acquire a token, then click the **Authorize** button to set your token.'
    )
    .setVersion('1.0')
    .addBearerAuth() // Hint: Tells Swagger we use JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.use(
    '/api/scalar',
    apiReference({
      theme: 'purple',
      spec: {
        content: document,
      },
      withFastify: true,
      hiddenClients: [
        'ruby', 'python', 'php', 'c', 'csharp', 'go', 'java', 'kotlin', 'objc', 'ocaml', 'r', 'swift', 'clojure'
      ],
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'axios',
      },
    }),
  );

  const port = process.env.PORT || 8080;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger UI is running on: ${await app.getUrl()}/api/docs`);
  logger.log(`Scalar API Reference is running on: ${await app.getUrl()}/api/scalar`);
}

bootstrap().catch((error) => {
  Logger.error(
    'Application failed to start',
    error instanceof Error ? error.stack : error,
    'System',
  );
  process.exit(1);
});
