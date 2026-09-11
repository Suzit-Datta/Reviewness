import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { Employee } from './employee.entity.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    photo?: Express.Multer.File,
  ): Promise<Employee> {
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      password: hashedPassword,
      image: photo ? photo.filename : createEmployeeDto.image,
    });
    try {
      return await this.employeeRepository.save(employee);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException('An employee with this email or username already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOneBy({ id });
  }

  async searchByName(name: string): Promise<Employee[]> {
    return this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.userName ILIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee | null> {
    if (updateEmployeeDto.password) {
      updateEmployeeDto.password = await bcrypt.hash(updateEmployeeDto.password, 10);
    }
    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.employeeRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (employee?.image) {
      try {
        await unlink(join('./uploads', employee.image));
      } catch {
        // file might already be missing — safe to ignore
      }
    }
    await this.employeeRepository.delete(id);
  }
}