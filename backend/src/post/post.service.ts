import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

import { Post } from './post.entity.js';
import { CreatePostDto } from './dtos/create-post.dto.js';
import { UpdatePostDto } from './dtos/update-post.dto.js';

import { User } from '../users/user.entity.js';
import { Product } from '../product/product.entity.js';

import { CompanyNotificationService } from '../company-notification/company-notification.service.js';

const UPLOADS_DIR = join(
  process.cwd(),
  'uploads',
);

function isErrorWithCode(
  error: unknown,
): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    postRepository: Repository<Post>,

    @InjectRepository(User)
    userRepository: Repository<User>,

    @InjectRepository(Product)
    productRepository: Repository<Product>,

    companyNotificationService: CompanyNotificationService,
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.companyNotificationService =
      companyNotificationService;
  }

  postRepository: Repository<Post>;
  userRepository: Repository<User>;
  productRepository: Repository<Product>;
  companyNotificationService: CompanyNotificationService;

  async getAllPosts(): Promise<Post[]> {
    try {
      return await this.postRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === 'ETIMEDOUT'
      ) {
        throw new RequestTimeoutException(
          'Request timed out',
          { cause: error },
        );
      }

      throw error;
    }
  }

  async getPostById(
    id: number,
  ): Promise<Post> {
    const post =
      await this.postRepository.findOne({
        where: { id },
      });

    if (!post) {
      throw new NotFoundException(
        `Post with id ${id} not found`,
      );
    }

    return post;
  }

  async getPostsByUserId(
    userId: number,
  ): Promise<Post[]> {
    const user =
      await this.userRepository.findOneBy({
        id: userId,
      });

    if (!user) {
      throw new NotFoundException(
        `User with id ${userId} not found`,
      );
    }

    return await this.postRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async assertUserExists(
    userId: number,
  ): Promise<void> {
    const user =
      await this.userRepository.findOneBy({
        id: userId,
      });

    if (!user) {
      throw new NotFoundException(
        `User with id ${userId} not found`,
      );
    }
  }

  async createPost(
    createPostDto: CreatePostDto,
    photo?: Express.Multer.File,
  ): Promise<Post> {
    await this.assertUserExists(
      createPostDto.userId,
    );

    const product =
      await this.productRepository.findOne({
        where: {
          id: createPostDto.productId,
        },
      });

    if (!product) {
      throw new NotFoundException(
        `Product with id ${createPostDto.productId} not found`,
      );
    }

    const companyId = product.companyId;

    try {
      const post =
        this.postRepository.create({
          ...createPostDto,
          companyId,
          image: photo
            ? photo.filename
            : undefined,
        });

      const savedPost =
        await this.postRepository.save(post);

      await this.companyNotificationService.sendReviewNotification(
        companyId,
        {
          postId: savedPost.id,
          productId: savedPost.productId,
          message:
            'Someone posted a new review on your product.',
        },
      );

      return savedPost;
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === 'ETIMEDOUT'
      ) {
        throw new RequestTimeoutException(
          'Request timed out',
          { cause: error },
        );
      }

      throw error;
    }
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    photo?: Express.Multer.File,
  ): Promise<Post> {
    const post =
      await this.getPostById(id);

    if (
      updatePostDto.userId !== undefined &&
      updatePostDto.userId !== post.userId
    ) {
      await this.assertUserExists(
        updatePostDto.userId,
      );
    }

    Object.assign(
      post,
      updatePostDto,
    );

    if (photo) {
      this.deleteOldPhoto(post.image);
      post.image = photo.filename;
    }

    return await this.postRepository.save(
      post,
    );
  }

  async patchPost(
    id: number,
    patchPostDto: UpdatePostDto,
    photo?: Express.Multer.File,
  ): Promise<Post> {
    const post =
      await this.getPostById(id);

    if (
      patchPostDto.userId !== undefined &&
      patchPostDto.userId !== post.userId
    ) {
      await this.assertUserExists(
        patchPostDto.userId,
      );
    }

    Object.assign(
      post,
      patchPostDto,
    );

    if (photo) {
      this.deleteOldPhoto(post.image);
      post.image = photo.filename;
    }

    return await this.postRepository.save(
      post,
    );
  }

  async deletePost(
    id: number,
  ): Promise<{ deleted: boolean }> {
    const post =
      await this.getPostById(id);

    this.deleteOldPhoto(post.image);

    await this.postRepository.delete(id);

    return {
      deleted: true,
    };
  }

  deleteOldPhoto(
    filename?: string,
  ) {
    if (!filename) {
      return;
    }

    const filePath = join(
      UPLOADS_DIR,
      filename,
    );

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  async getPostsByCompanyId(
    companyId: number,
  ) {
    return this.postRepository.find({
      where: {
        companyId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}