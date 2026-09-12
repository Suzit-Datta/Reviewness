import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Product } from './product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create product
  async create(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product =
      this.productRepository.create(createProductDto);

    return await this.productRepository.save(product);
  }

  // Get all products
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  // Search products by name
  async searchByName(name: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  // Get product by ID
  async findOne(id: number): Promise<Product> {
    const product =
      await this.productRepository.findOne({
        where: { id },
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return product;
  }

  // Update product
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product =
      await this.productRepository.findOne({
        where: { id },
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  // Delete product
  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const product =
      await this.productRepository.findOne({
        where: { id },
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    await this.productRepository.remove(product);

    return {
      message: 'Product deleted successfully',
    };
  }
}
