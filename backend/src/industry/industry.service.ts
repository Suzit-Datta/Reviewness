import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Industry } from './industry.entity.js';
import { Company } from '../company/company.entity.js';
import { CreateIndustryDto } from './dto/create-industry.dto.js';
import { UpdateIndustryDto } from './dto/update-industry.dto.js';

@Injectable()
export class IndustryService {
  constructor(
    @InjectRepository(Industry) private industryRepository: Repository<Industry>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async create(createIndustryDto: CreateIndustryDto): Promise<Industry> {
    const industry = this.industryRepository.create(createIndustryDto);
    try {
      return await this.industryRepository.save(industry);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException('An industry with this name already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Industry[]> {
    return this.industryRepository.find();
  }

  async findOne(id: number): Promise<Industry | null> {
    return this.industryRepository.findOneBy({ id });
  }

  async findCompaniesByIndustry(industryId: number): Promise<Company[]> {
    return this.companyRepository.find({ where: { industryId } });
  }

  async update(id: number, updateIndustryDto: UpdateIndustryDto): Promise<Industry | null> {
    await this.industryRepository.update(id, updateIndustryDto);
    return this.industryRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.industryRepository.delete(id);
  }
}