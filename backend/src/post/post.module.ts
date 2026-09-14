import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';
import { Post } from './post.entity.js';

import { User } from '../users/user.entity.js';
import { Product } from '../product/product.entity.js';

import { CompanyNotificationModule } from '../company-notification/company-notification.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      Product,
    ]),

    CompanyNotificationModule,
  ],

  controllers: [PostController],

  providers: [PostService],
})
export class PostModule { }