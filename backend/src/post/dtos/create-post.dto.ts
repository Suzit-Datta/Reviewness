import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  caption: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @Type(() => Number)
  @IsNumber()
  userId: number;

  @Type(() => Number)
  @IsNumber()
  companyId: number;

  @Type(() => Number)
  @IsNumber()
  categoryId: number;

  @Type(() => Number)
  @IsNumber()
  productId: number;

}
