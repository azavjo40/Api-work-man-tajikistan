import { IsString, IsArray, IsBoolean } from 'class-validator';

export class AdsDto {
  @IsString()
  title: string;

  @IsString()
  city: string;

  @IsString()
  description: string;

  @IsString()
  userId: string;

  @IsArray()
  skils: string[];

  @IsArray()
  images: string[];

  @IsBoolean()
  isPublish: boolean;

  dateCreated?: string;
}
