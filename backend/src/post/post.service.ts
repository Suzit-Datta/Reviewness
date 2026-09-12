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

const UPLOADS_DIR = join(process.cwd(), 'uploads');

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
    private readonly postRepository: Repository<Post>,
  ) { }

  async getAllPosts(): Promise<Post[]> {
    try {
      return await this.postRepository.find();
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === 'ETIMEDOUT'
      ) {
        throw new RequestTimeoutException(
          'request timed out error',
          { cause: error },
        );
      }

      throw error;
    }
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({
      id,
    });

    if (!post) {
      throw new NotFoundException(
        `Post with id ${id} not found`,
      );
    }

    return post;
  }

  async createPost(
    createPostDto: CreatePostDto,
    photo?: Express.Multer.File,
  ): Promise<Post> {
    try {
      const post = this.postRepository.create({
        ...createPostDto,
        image: photo
          ? photo.filename
          : undefined,
      });

      return await this.postRepository.save(post);
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === 'ETIMEDOUT'
      ) {
        throw new RequestTimeoutException(
          'request timed out error',
          { cause: error },
        );
      }

      throw error;
    }
  }

  async updatePost(
    id: number,
    updatePostDto: CreatePostDto,
    photo?: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.getPostById(id);

    post.caption = updatePostDto.caption;
    post.rating = updatePostDto.rating;

    if (photo) {
      this.deleteOldPhoto(post.image);
      post.image = photo.filename;
    }

    return await this.postRepository.save(post);
  }

  async patchPost(
    id: number,
    patchPostDto: UpdatePostDto,
    photo?: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.getPostById(id);

    Object.assign(post, patchPostDto);

    if (photo) {
      this.deleteOldPhoto(post.image);
      post.image = photo.filename;
    }

    return await this.postRepository.save(post);
  }

  async deletePost(
    id: number,
  ): Promise<{ deleted: boolean }> {
    const post = await this.getPostById(id);

    this.deleteOldPhoto(post.image);

    await this.postRepository.delete(id);

    return {
      deleted: true,
    };
  }

  deleteOldPhoto(filename?: string) {
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
}
