import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service.js';
import { EmployeeController } from './employee.controller.js';
import { Employee } from './employee.entity.js';
import {AuthModule} from '../auth/auth.module.js'


@Module({
  imports: [TypeOrmModule.forFeature([Employee]),AuthModule,],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}