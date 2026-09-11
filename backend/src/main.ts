import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,             // strips unknown properties
    forbidNonWhitelisted: true,  // errors on unknown properties
    transform: true,             // auto-converts payloads to DTO types
  }),
);
  await app.listen(process.env.PORT ?? 7000);
}

await bootstrap();
