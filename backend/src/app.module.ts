import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AdminModule } from './admin/admin.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServeStaticModule } from '@nestjs/serve-static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CommentModule } from './comment/comment.module.js';
import { CategoryModule } from './category/category.module.js';

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilename);

@Module({
    imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env vars available everywhere, no re-importing
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // DEV ONLY — auto-creates tables. Turn OFF in production.
    }),
      ServeStaticModule.forRoot({
      rootPath: join(currentDirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AdminModule,
    CommentModule,
    CategoryModule
    // ...AdminModule is already here from the CLI
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
