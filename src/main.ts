import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { validateEnv } from '../config/env.schema';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Load environment file based on NODE_ENV
  const env = process.env.NODE_ENV || 'development';
  const envPath = `.env.${env}`;

  // Load environment variables
  const envConfig = config({ path: envPath }).parsed || config().parsed;

  if (!envConfig) {
    logger.warn(`No .env file found (tried ${envPath} and .env). Using process.env directly.`);
  } else {
    validateEnv(envConfig);
    Object.assign(process.env, envConfig);
  }

  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Book Management System API')
    .setDescription('API documentation for Book Management System')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  const port = process.env.APP_PORT || 3000;
  const host = process.env.APP_HOST || 'localhost';

  await app.listen(port);
  console.log(`Application is running on: http://${host}:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
