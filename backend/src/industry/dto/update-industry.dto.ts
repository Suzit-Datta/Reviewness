import { PartialType } from '@nestjs/mapped-types';
import { CreateIndustryDto } from './create-industry.dto.js';

export class UpdateIndustryDto extends PartialType(CreateIndustryDto) {}