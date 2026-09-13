import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Like } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { unlink } from 'fs/promises';
import { join } from 'path';

import { Company } from './company.entity.js';

import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';

import { MailService } from '../mail/mail.service.js';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    companyRepository: Repository<Company>,

    mailService: MailService,
  ) {
    this.companyRepository = companyRepository;
    this.mailService = mailService;
  }

  companyRepository: Repository<Company>;
  mailService: MailService;

  // Create company
  async create(
    createCompanyDto: CreateCompanyDto,
    file?: Express.Multer.File,
  ): Promise<Company> {
    const existingCompany =
      await this.companyRepository.findOne({
        where: {
          email: createCompanyDto.email,
        },
      });

    if (existingCompany) {
      throw new ConflictException(
        'Company with this email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(
      createCompanyDto.password,
      10,
    );

    // Create company
    const company =
      this.companyRepository.create({
        ...createCompanyDto,
        password: hashedPassword,

        logo: file
          ? `/uploads/${file.filename}`
          : undefined,

        isSubscribe: false,
        isApproved: false,
      });

    // Save company
    const savedCompany =
      await this.companyRepository.save(company);

    // Send registration email
    await this.mailService.sendRegistrationMail(
      savedCompany.email,
      savedCompany.companyName,
    );

    return savedCompany;
  }

  // Get all companies
  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  // Get company by ID
  async findOne(id: number): Promise<Company> {
    const company =
      await this.companyRepository.findOne({
        where: { id },
      });

    if (!company) {
      throw new NotFoundException(
        'Company not found',
      );
    }

    return company;
  }

  // Search company by name
  async searchByName(
    name: string,
  ): Promise<Company[]> {
    return await this.companyRepository.find({
      where: {
        companyName: Like(`%${name}%`),
      },
    });
  }

  // Update company
  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    file?: Express.Multer.File,
  ): Promise<Company> {
    const company =
      await this.companyRepository.findOne({
        where: { id },
      });

    if (!company) {
      throw new NotFoundException(
        'Company not found',
      );
    }

    // Check email
    if (updateCompanyDto.email) {
      const existingCompany =
        await this.companyRepository.findOne({
          where: {
            email: updateCompanyDto.email,
          },
        });

      if (
        existingCompany &&
        existingCompany.id !== id
      ) {
        throw new ConflictException(
          'Company with this email already exists',
        );
      }
    }

    // Hash new password
    if (updateCompanyDto.password) {
      updateCompanyDto.password =
        await bcrypt.hash(
          updateCompanyDto.password,
          10,
        );
    }

    // Update logo
    if (file) {
      // Delete old logo
      if (company.logo) {
        const oldFilePath = join(
          process.cwd(),
          company.logo.replace(/^\/+/, ''),
        );

        try {
          await unlink(oldFilePath);
        } catch (error) {
          console.log(
            'Old logo file not found:',
            oldFilePath,
          );
        }
      }

      // Save new logo path
      company.logo =
        `/uploads/${file.filename}`;
    }

    // Update other company information
    Object.assign(
      company,
      updateCompanyDto,
    );

    return await this.companyRepository.save(
      company,
    );
  }

  // Delete company
  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const company =
      await this.companyRepository.findOne({
        where: { id },
      });

    if (!company) {
      throw new NotFoundException(
        'Company not found',
      );
    }

    // Delete logo file
    if (company.logo) {
      const filePath = join(
        process.cwd(),
        company.logo.replace(/^\/+/, ''),
      );

      try {
        await unlink(filePath);
      } catch (error) {
        console.log(
          'Logo file not found:',
          filePath,
        );
      }
    }

    // Delete company from database
    await this.companyRepository.remove(
      company,
    );

    return {
      message: 'Company deleted successfully',
    };
  }
}