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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdminService } from './admin.service.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';
import { UpdateAdminSettingsDto } from './dto/update-admin-settings.dto.js'; 

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
  findAll() {
    return this.adminService.findAll();
  }
  @Get('search')
  searchByName(@Query('name') name: string) {
  return this.adminService.searchByName(name);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
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
    updateSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() settingsDto: UpdateAdminSettingsDto,
  ) {
  return this.adminService.updateSettings(id, settingsDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}