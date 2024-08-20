import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Load .env file

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT
  const host = process.env.HOSTNAME
  
  await app.listen(port, () => {
    Logger.log(`Application is running on: http://${host}:${port}`);

  });
}

bootstrap();
