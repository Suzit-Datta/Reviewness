import {
  Controller,
  Get,
  Post as PostMethod,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from './post.service.js';

import { CreatePostDto } from './dtos/create-post.dto.js';
import { UpdatePostDto } from './dtos/update-post.dto.js';

@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
  ) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postService.getPostById(id);
  }

  @PostMethod()
  @UseInterceptors(
    FileInterceptor('photo'),
  )
  createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.postService.createPost(
      createPostDto,
      photo,
    );
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo'),
  )
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.postService.updatePost(
      id,
      updatePostDto,
      photo,
    );
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo'),
  )
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.postService.patchPost(
      id,
      updatePostDto,
      photo,
    );
  }

  @Delete(':id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postService.deletePost(id);
  }
}
