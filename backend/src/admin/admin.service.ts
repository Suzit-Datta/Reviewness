import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, ILike } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { join } from 'path';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

import { Admin } from './entities/admin.entity.js';
import { AdminSettings } from './entities/admin-settings.entity.js';

import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';
import { UpdateAdminSettingsDto } from './dto/update-admin-settings.dto.js';

import {
  Employee,
  EmployeeStatus,
} from '../employee/employee.entity.js';

import { MailService } from '../mail/mail.service.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    adminRepository: Repository<Admin>,

    @InjectRepository(Employee)
    employeeRepository: Repository<Employee>,

    mailService: MailService,
  ) {
    this.adminRepository = adminRepository;
    this.employeeRepository = employeeRepository;
    this.mailService = mailService;
  }

  adminRepository: Repository<Admin>;
  employeeRepository: Repository<Employee>;
  mailService: MailService;

  // Create admin
  async create(
    createAdminDto: CreateAdminDto,
    image?: Express.Multer.File,
  ): Promise<Admin> {
    const existing = await this.adminRepository.findOne({
      where: {
        email: createAdminDto.email,
      },
    });

    if (existing) {
      throw new ConflictException(
        'An admin with this email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(
      createAdminDto.password,
      10,
    );

    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
      image: image?.filename,
      settings: new AdminSettings(),
    });

    const savedAdmin =
      await this.adminRepository.save(admin);

    // Send registration email
    await this.mailService.sendRegistrationMail(
      savedAdmin.email,
      savedAdmin.name,
    );

    return savedAdmin;
  }

  // Get all admins
  findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  // Search admin by name
  searchByName(name: string): Promise<Admin[]> {
    return this.adminRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
  }

  // Get admin by ID
  async findOne(id: number): Promise<Admin> {
    const admin =
      await this.adminRepository.findOne({
        where: { id },
      });

    if (!admin) {
      throw new NotFoundException(
        `Admin with id ${id} not found`,
      );
    }

    return admin;
  }

  // Update admin
  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
    image?: Express.Multer.File,
  ): Promise<Admin> {
    const admin = await this.findOne(id);

    // Hash new password
    if (updateAdminDto.password) {
      updateAdminDto.password =
        await bcrypt.hash(
          updateAdminDto.password,
          10,
        );
    }

    Object.assign(
      admin,
      updateAdminDto,
    );

    // Update image
    if (image) {
      const oldImage = admin.image;

      admin.image = image.filename;

      await this.deleteImageFile(oldImage);
    }

    return await this.adminRepository.save(admin);
  }

  // Update admin settings
  async updateSettings(
    id: number,
    settingsDto: UpdateAdminSettingsDto,
  ): Promise<AdminSettings> {
    const admin = await this.findOne(id);

    Object.assign(
      admin.settings,
      settingsDto,
    );

    await this.adminRepository.save(admin);

    return admin.settings;
  }

  // Delete admin
  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const admin = await this.findOne(id);

    const imageFile = admin.image;

    await this.adminRepository.remove(admin);

    await this.deleteImageFile(imageFile);

    return {
      message: `Admin ${id} removed successfully`,
    };
  }

  // Delete admin image
  async deleteImageFile(
    filename?: string,
  ): Promise<void> {
    if (!filename) {
      return;
    }

    const imagePath = join(
      process.cwd(),
      'uploads',
      filename,
    );

    try {
      if (existsSync(imagePath)) {
        await unlink(imagePath);
      }
    } catch (error) {
      console.error(
        `Failed to delete image file: ${filename}`,
        error,
      );
    }
  }

  // =========================
  // Employee Management
  // =========================

  // Get pending employees
  findPendingEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: {
        status: EmployeeStatus.PENDING,
      },
    });
  }

  // Approve employee
  async approveEmployee(
    employeeId: number,
    adminId: number,
  ): Promise<Employee> {
    const employee =
      await this.employeeRepository.findOne({
        where: {
          id: employeeId,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        `Employee ${employeeId} not found`,
      );
    }

    employee.status =
      EmployeeStatus.APPROVED;

    employee.approvedByAdmin =
      { id: adminId } as Admin;

    return await this.employeeRepository.save(
      employee,
    );
  }

  // Reject employee
  async rejectEmployee(
    employeeId: number,
  ): Promise<Employee> {
    const employee =
      await this.employeeRepository.findOne({
        where: {
          id: employeeId,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        `Employee ${employeeId} not found`,
      );
    }

    employee.status =
      EmployeeStatus.REJECTED;

    return await this.employeeRepository.save(
      employee,
    );
  }
}