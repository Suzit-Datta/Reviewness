import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAdminSettingsDto {
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;

  @IsOptional()
  @IsIn(['en', 'bn'])
  language?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;
}