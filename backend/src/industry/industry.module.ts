import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustryService } from './industry.service.js';
import { IndustryController } from './industry.controller.js';
import { Industry } from './industry.entity.js';
import { Company } from '../company/company.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Industry, Company])],
  controllers: [IndustryController],
  providers: [IndustryService],
})
export class IndustryModule {}