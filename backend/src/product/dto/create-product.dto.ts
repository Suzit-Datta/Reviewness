import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  companyId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
