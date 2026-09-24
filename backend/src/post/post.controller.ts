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
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { PostService } from './post.service.js';

import { CreatePostDto } from './dtos/create-post.dto.js';
import { UpdatePostDto } from './dtos/update-post.dto.js';

// Shared upload config for the post `photo` field: writes the file to
// ./uploads with a unique name so `photo.filename` is populated and can
// be persisted on the post entity.
const photoUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (request, file, callback) => {
      const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1000000);
      const extension = extname(file.originalname).toLowerCase();
      callback(null, uniqueName + extension);
    },
  }),
  limits: {
    fileSize: 3000000,
  },
  fileFilter: (request, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    if (!allowedExtensions.includes(extension)) {
      return callback(
        new BadRequestException('Only JPG, JPEG and PNG images are allowed'),
        false,
      );
    }
    callback(null, true);
  },
};

@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
  ) { }

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get('user/:userId')
  public getPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.getPostsByUserId(userId);
  }

  @Get(':id')
  getPostById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postService.getPostById(id);
  }

  @PostMethod()
  @UseInterceptors(
    FileInterceptor('photo', photoUploadOptions),
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
    FileInterceptor('photo', photoUploadOptions),
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
    FileInterceptor('photo', photoUploadOptions),
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

  @Get('company/:companyId')
  getPostsByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.postService.getPostsByCompanyId(companyId);
  }
}
