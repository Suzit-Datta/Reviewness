import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

import { Admin } from '../admin/entities/admin.entity.js';
import { User } from '../users/user.entity.js';
import { Company } from '../company/company.entity.js';
import { Employee } from '../employee/employee.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      User,
      Company,
      Employee,
    ]),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      global: true,

      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule { }