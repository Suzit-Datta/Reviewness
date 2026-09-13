import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create product
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(
      createProductDto,
    );
  }

  // Get all products
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  // Search product by name
  // products/search?name=iphone
  @Get('search')
  searchByName(@Query('name') name: string) {
    return this.productService.searchByName(name);
  }

  // Get product by ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  // Get all posts under a product
  @Get(':id/posts')
  findPostsByProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findPostsByProduct(id);
  }

  // Update product
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  // Delete product
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Get('company/:companyId')
  findByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
  return this.productService.findByCompany(companyId);
  }
}
