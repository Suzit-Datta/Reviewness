import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CommentService } from './comment.service.js';

import { CreateCommentDto } from './dto/create-comment.dto.js';

import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Controller('comment')
export class CommentController {
  constructor(
    commentService: CommentService,
  ) {
    this.commentService = commentService;
  }

  commentService: CommentService;

  @Post()
  create(
    @Body()
    createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(
      createCommentDto,
    );
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('post/:postId')
  findByPost(
    @Param('postId', ParseIntPipe)
    postId: number,
  ) {
    return this.commentService.findByPost(
      postId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(
      id,
      updateCommentDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.commentService.remove(id);
  }
}
