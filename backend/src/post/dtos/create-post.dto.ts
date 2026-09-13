import {
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

  // multipart/form-data sends every field as a string, so this
  // converts "4.5" -> 4.5 before the @IsNumber() check runs.
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

  // Note: no `image` field here on purpose — the photo comes in as a
  // multipart file (field name "photo"), not as a JSON/body property.
  // The service sets `image` itself from the uploaded file's filename.
}