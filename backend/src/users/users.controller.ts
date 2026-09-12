import {
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
  BadRequestException,
  Query,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UsersService } from './users.service.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
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
            new BadRequestException(
              'Only JPG, JPEG and PNG images are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  public createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    photo: Express.Multer.File,
  ) {
    return this.usersService.createUser(createUserDto, photo);
  }

  @Get()
  public getUsers(@Query('userName') userName?: string) {
    if (userName) {
      return this.usersService.getUserByUserName(userName);
    }

    return this.usersService.getAllUsers();
  }

  @Get(':id')
  public getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
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
            new BadRequestException(
              'Only JPG, JPEG and PNG images are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  public updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: CreateUserDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    photo: Express.Multer.File,
  ) {
    return this.usersService.updateUser(id, updateUserDto, photo);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
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
            new BadRequestException(
              'Only JPG, JPEG and PNG images are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  public patchUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: UpdateUserDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    photo: Express.Multer.File,
  ) {
    return this.usersService.patchUser(id, patchUserDto, photo);
  }

  @Delete(':id')
  public deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.softDeleteUser(id);
  }
}
