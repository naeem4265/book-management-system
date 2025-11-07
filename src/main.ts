import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { validateEnv } from './config/env.schema';
import { Logger } from '@nestjs/common';

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

  const port = process.env.APP_PORT || 3000;
  const host = process.env.APP_HOST || 'localhost';

  await app.listen(port);
  console.log(`Application is running on: http://${host}:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
