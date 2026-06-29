/**
 * BookNest API - Application Entry Point
 *
 * This file bootstraps the NestJS application with:
 * - Global prefix (/api)
 * - CORS for frontend origins
 * - Global exception filter (Persian error messages)
 * - Global response transformer (wraps in { data, success, timestamp })
 * - Global validation pipe (whitelist + transform DTOs)
 * - Swagger documentation at /api/docs
 *
 * @see docs/ARCHITECTURE.md for system overview
 * @see docs/API.md for endpoint documentation
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes prefixed with /api (e.g., /api/books)
  app.setGlobalPrefix('api');

  // Allow frontend to make API requests
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global middleware - applied to ALL routes
  app.useGlobalFilters(new AllExceptionsFilter());       // Catch errors → Persian messages
  app.useGlobalInterceptors(new TransformInterceptor()); // Wrap responses in { data, success, timestamp }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Strip unknown properties from DTOs
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true,            // Auto-transform payloads to DTO instances
    }),
  );

  // Swagger API documentation (available at /api/docs)
  const config = new DocumentBuilder()
    .setTitle('BookNest API')
    .setDescription('Multi-Vendor Bookstore Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 BookNest API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
