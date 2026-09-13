import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { Admin } from './entities/admin.entity.js';
import { AdminSettings } from './entities/admin-settings.entity.js'; 
import {Employee} from '../employee/employee.entity.js'
import { AuthModule } from '../auth/auth.module.js';
@Module({
  imports: [TypeOrmModule.forFeature([Admin,AdminSettings,Employee,]),AuthModule,],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}