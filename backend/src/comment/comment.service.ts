import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    commentRepository: Repository<Comment>,
  ) {
    this.commentRepository = commentRepository;
  }

  commentRepository: Repository<Comment>;

  create(
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const comment =
      this.commentRepository.create(
        createCommentDto,
      );

    return this.commentRepository.save(comment);
  }

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: {
        postId: postId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment =
      await this.commentRepository.findOne({
        where: { id },
      });

    if (!comment) {
      throw new NotFoundException(
        `Comment with id ${id} not found`,
      );
    }

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    Object.assign(
      comment,
      updateCommentDto,
    );

    return this.commentRepository.save(comment);
  }

  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const comment = await this.findOne(id);

    await this.commentRepository.remove(comment);

    return {
      message: `Comment ${id} removed successfully`,
    };
  }
}
