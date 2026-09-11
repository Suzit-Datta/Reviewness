import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { Admin } from './entities/admin.entity.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';
import { ILike } from 'typeorm';   

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(
    createAdminDto: CreateAdminDto,
    image?: Express.Multer.File,
  ): Promise<Admin> {
    const existing = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });
    if (existing) {
      throw new ConflictException('An admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
      image: image?.filename,
    });

    return this.adminRepository.save(admin);
  }

  findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return admin;
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
    image?: Express.Multer.File,
  ): Promise<Admin> {
    const admin = await this.findOne(id);

    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    Object.assign(admin, updateAdminDto);

    if (image) {
      const oldImage = admin.image;
      admin.image = image.filename;
      await this.deleteImageFile(oldImage);
    }

    return this.adminRepository.save(admin);
  }

  async remove(id: number): Promise<{ message: string }> {
    const admin = await this.findOne(id);

    const imageFile = admin.image;

    await this.adminRepository.remove(admin);

    await this.deleteImageFile(imageFile);

    return { message: `Admin ${id} removed successfully` };
  }

  private async deleteImageFile(filename?: string): Promise<void> {
    if (!filename) {
      return;
    }

    const imagePath = join(process.cwd(), 'uploads', filename);

    try {
      if (existsSync(imagePath)) {
        await unlink(imagePath);
      }
    } catch (error) {
      console.error(`Failed to delete image file: ${filename}`, error);
    }
  }

  searchByName(name: string): Promise<Admin[]> {
  return this.adminRepository.find({
    where: { name: ILike(`%${name}%`) },
  });
  }
}

