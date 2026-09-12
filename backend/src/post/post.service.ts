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

function isErrorWithCode(error: unknown): error is { code: string } {
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
  ) {}

  public async getAllPosts(): Promise<Post[]> {
    try {
      return await this.postRepository.find();
    } catch (error) {
      if (isErrorWithCode(error) && error.code === 'ETIMEDOUT') {
        throw new RequestTimeoutException('request timed out error', {
          cause: error,
        });
      }
      throw error;
    }
  }

  public async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  public async createPost(
    createPostDto: CreatePostDto,
    photo?: Express.Multer.File,
  ): Promise<Post> {
    try {
      const post = this.postRepository.create({
        ...createPostDto,
        image: photo ? photo.filename : undefined,
      });

      return await this.postRepository.save(post);
    } catch (error) {
      if (isErrorWithCode(error) && error.code === 'ETIMEDOUT') {
        throw new RequestTimeoutException('request timed out error', {
          cause: error,
        });
      }
      throw error;
    }
  }

  // PUT — full replace. Photo is still optional: send a new one to
  // replace the picture, or omit it to keep the existing one.
  public async updatePost(
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

  // PATCH — partial update, only sent fields (and photo, if provided) change
  public async patchPost(
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

  // Hard delete — no `deletedAt` column on this entity, so the row
  // is actually removed (unlike Users, which soft-deletes).
  public async deletePost(id: number): Promise<{ deleted: boolean }> {
    const post = await this.getPostById(id); // throws NotFoundException if missing
    this.deleteOldPhoto(post.image);
    await this.postRepository.delete(id);
    return { deleted: true };
  }

  // Best-effort cleanup so replaced/removed photos don't pile up on disk.
  private deleteOldPhoto(filename?: string) {
    if (!filename) return;
    const filePath = join(UPLOADS_DIR, filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
