import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';

export class UpdateCompanyDto {

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  companyName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  industryId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}