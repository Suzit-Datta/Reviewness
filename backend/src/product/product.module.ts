import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './product.entity.js';
import { Post } from '../post/post.entity.js';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Post])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}