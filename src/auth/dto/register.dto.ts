import { IsNotEmpty, IsString, IsArray, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @IsPhoneNumber()
  username: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsArray()
  roles: string[];

  dateCreated?: string;

  image?: string;
  isAbs?: boolean;
}
