import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

import { User } from './user.entity.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

function isErrorWithCode(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Get all users
  public async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      if (isErrorWithCode(error) && error.code === 'ETIMEDOUT') {
        throw new RequestTimeoutException('request timed out error', {
          cause: error,
        });
      }

      throw error;
    }
  }

  // Get user by ID
  public async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  // Get user by username
  public async getUserByUserName(userName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        userName: userName,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${userName} not found`);
    }

    return user;
  }

  // Create user
  public async createUser(
    createUserDto: CreateUserDto,
    photo?: Express.Multer.File,
  ): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: createUserDto.email },
          { userName: createUserDto.userName },
        ],
      });

      if (existingUser) {
        throw new BadRequestException(
          'User with this email or username already exists',
        );
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        image: photo ? photo.filename : undefined,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (isErrorWithCode(error) && error.code === 'ETIMEDOUT') {
        throw new RequestTimeoutException('request timed out error', {
          cause: error,
        });
      }

      throw error;
    }
  }

  // Full update
  public async updateUser(
    id: number,
    updateUserDto: CreateUserDto,
    photo?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.getUserById(id);

    user.userName = updateUserDto.userName;
    user.email = updateUserDto.email;
    user.gender = updateUserDto.gender;

    user.password = await bcrypt.hash(updateUserDto.password, 10);

    if (photo) {
      this.deleteOldPhoto(user.image);
      user.image = photo.filename;
    }

    return await this.userRepository.save(user);
  }

  // Partial update
  public async patchUser(
    id: number,
    patchUserDto: UpdateUserDto,
    photo?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.getUserById(id);

    if (patchUserDto.password) {
      patchUserDto.password = await bcrypt.hash(patchUserDto.password, 10);
    }

    Object.assign(user, patchUserDto);

    if (photo) {
      this.deleteOldPhoto(user.image);
      user.image = photo.filename;
    }

    return await this.userRepository.save(user);
  }

  // Soft delete
  public async softDeleteUser(id: number): Promise<{ deleted: boolean }> {
    await this.getUserById(id);

    await this.userRepository.softDelete(id);

    return {
      deleted: true,
    };
  }

  // Delete old image from uploads folder
  private deleteOldPhoto(filename?: string) {
    if (!filename) {
      return;
    }

    const filePath = join(UPLOADS_DIR, filename);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
