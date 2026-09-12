import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustryService } from './industry.service.js';
import { IndustryController } from './industry.controller.js';
import { Industry } from './industry.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Industry])],
  controllers: [IndustryController],
  providers: [IndustryService],
})
export class IndustryModule {}