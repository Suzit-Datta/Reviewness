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
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UsersService } from './users.service.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/roles.enum.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Registration — left OPEN (users self-register)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public getUsers(@Query('userName') userName?: string) {
    if (userName) {
      return this.usersService.getUserByUserName(userName);
    }
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.softDeleteUser(id);
  }
}