import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  position?: string;
}