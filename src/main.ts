import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  logger.log('Starting application...');

  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

    logger.log('NestJS application created');

    // Enable CORS
    app.enableCors();

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    logger.log('Global pipes configured');

    const swaggerConfig = new DocumentBuilder()
      .setTitle('KandongaPOS Backend')
      .setDescription('Gestão financeira para micro empreendedores informais em Angola')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, swaggerDocument);

    logger.log('Swagger configured');

    const port = process.env.PORT || 3000;
    logger.log(`Attempting to listen on port ${port}...`);

    await app.listen(port, '0.0.0.0');

    logger.log(`Server is running at http://localhost:${port}`);
    logger.log(`API documentation available at http://localhost:${port}/api`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  logger.error('Bootstrap error:', error);
  process.exit(1);
});


