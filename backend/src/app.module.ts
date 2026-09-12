import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';

import { ServeStaticModule } from '@nestjs/serve-static';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilename);

@Module({
  imports: [
    UsersModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      autoLoadEntities: true,
      synchronize: true,

      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(currentDirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
