import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
//import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 7000);
}

bootstrap();
