import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EmployeeService } from './employee.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
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
              'Only JPG, JPEG and PNG photos are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  createEmployee(
    @Body()
    createEmployeeDto: CreateEmployeeDto,

    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    photo: Express.Multer.File,
  ) {
    return this.employeeService.create(createEmployeeDto, photo);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  // Search by name — MUST come before @Get(':id') or NestJS will treat
  // "search" as an :id value instead of matching this route.
  @Get('search')
  searchByName(@Query('name') name: string) {
    return this.employeeService.searchByName(name);
  }

  // Search by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}