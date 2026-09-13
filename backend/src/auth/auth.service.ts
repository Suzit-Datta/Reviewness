import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Admin } from '../admin/entities/admin.entity.js';
import { User } from '../users/user.entity.js';
import { Company } from '../company/company.entity.js';
import { Employee, EmployeeStatus } from '../employee/employee.entity.js';
import { Role } from './roles.enum.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { role, email, password } = loginDto;

    const account = await this.findAccountByRole(role, email);
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, account.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Employee gate: must be APPROVED
    if (role === Role.EMPLOYEE) {
      const employee = account as Employee;
      if (employee.status !== EmployeeStatus.APPROVED) {
        throw new ForbiddenException(
          `Your account is ${employee.status.toLowerCase()}. An admin must approve it before you can log in.`,
        );
      }
    }

    const payload = { sub: account.id, role };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, role, id: account.id };
  }

  private async findAccountByRole(
    role: Role,
    email: string,
  ): Promise<Admin | User | Company | Employee | null> {
    switch (role) {
      case Role.ADMIN:
        // admin password is select:false — must add it explicitly
        return this.adminRepository
          .createQueryBuilder('admin')
          .addSelect('admin.password')
          .where('admin.email = :email', { email })
          .getOne();

      case Role.USER:
        return this.userRepository.findOne({ where: { email } });

      case Role.COMPANY:
        return this.companyRepository.findOne({ where: { email } });

      case Role.EMPLOYEE:
        return this.employeeRepository.findOne({ where: { email } });

      default:
        return null;
    }
  }
}