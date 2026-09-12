import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EmployeeModule } from './employee/employee.module.js';
import { CompanyModule } from './company/company.module.js';
import { ProductModule } from './product/product.module.js';
import { AdminModule } from './admin/admin.module.js';
import { CommentModule } from './comment/comment.module.js';
import { CategoryModule } from './category/category.module.js';
import { IndustryModule } from './industry/industry.module.js';


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
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    EmployeeModule,
    CompanyModule,
    ProductModule,
    AdminModule,
    CommentModule,
    CategoryModule,
    IndustryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
