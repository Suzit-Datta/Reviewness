import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { PostService } from './post.service.js';
import { CreatePostDto } from './dtos/create-post.dto.js';
import { UpdatePostDto } from './dtos/update-post.dto.js';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const photoUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: UPLOADS_DIR,

    filename: (request, file, callback) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1000000);

      const extension = extname(file.originalname).toLowerCase();

      callback(null, uniqueName + extension);
    },
  }),

  limits: {
    fileSize: 3000000, // 3MB
  },

  fileFilter: (request, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return callback(
        new BadRequestException('Only JPG, JPEG and PNG photos are allowed'),
        false,
      );
    }

    callback(null, true);
  },
};

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions))
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    photo: Express.Multer.File,
  ) {
    return this.postService.createPost(createPostDto, photo);
  }

  @Get()
  public getPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  public getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions))
  public updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: CreatePostDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    photo: Express.Multer.File,
  ) {
    return this.postService.updatePost(id, updatePostDto, photo);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions))
  public patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchPostDto: UpdatePostDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    photo: Express.Multer.File,
  ) {
    return this.postService.patchPost(id, patchPostDto, photo);
  }

  @Delete(':id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
