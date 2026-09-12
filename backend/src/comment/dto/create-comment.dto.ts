import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsOptional()
  @IsInt()
  companyId?: number;
}