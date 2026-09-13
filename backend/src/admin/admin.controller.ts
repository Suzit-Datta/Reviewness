import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  BadRequestException,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdminService } from './admin.service.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';
import { UpdateAdminSettingsDto } from './dto/update-admin-settings.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/roles.enum.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Registration — left OPEN so the first admin can be created
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (request, file, callback) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1000000);
          let extension = '.jpg';
          if (file.mimetype === 'image/png') {
            extension = '.png';
          }
          callback(null, uniqueName + extension);
        },
      }),
      limits: {
        fileSize: 3000000,
      },
      fileFilter: (request, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
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
  create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    image: Express.Multer.File,
  ) {
    return this.adminService.create(createAdminDto, image);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.adminService.findAll();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  searchByName(@Query('name') name: string) {
    return this.adminService.searchByName(name);
  }

  // Employee management — declared before :id routes
  @Get('employees/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findPendingEmployees() {
    return this.adminService.findPendingEmployees();
  }

  @Patch('employees/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  approveEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.adminService.approveEmployee(id, req.user.id);
  }

  @Patch('employees/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  rejectEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.rejectEmployee(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (request, file, callback) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1000000);
          let extension = '.jpg';
          if (file.mimetype === 'image/png') {
            extension = '.png';
          }
          callback(null, uniqueName + extension);
        },
      }),
      limits: {
        fileSize: 3000000,
      },
      fileFilter: (request, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    image: Express.Multer.File,
  ) {
    return this.adminService.update(id, updateAdminDto, image);
  }

  @Patch(':id/settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() settingsDto: UpdateAdminSettingsDto,
  ) {
    return this.adminService.updateSettings(id, settingsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}