import { IsString } from 'class-validator';

export class CreateIndustryDto {
  @IsString()
  industryName: string;
}