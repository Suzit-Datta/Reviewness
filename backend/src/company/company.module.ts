import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from './company.entity.js';
import { CompanyController } from './company.controller.js';
import { CompanyService } from './company.service.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company
    ]),
    MailModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}