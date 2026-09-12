import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(24)
  userName: string;

  @MinLength(8, { message: 'email should have a minimum of 8 characters' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;

  @IsIn(['male', 'female', 'other'])
  @IsNotEmpty()
  gender: string;

  // Note: no `image` field here on purpose — the photo comes in as a
  // multipart file (field name "photo"), not as a JSON/body property.
  // The service sets `image` itself from the uploaded file's filename.
}
