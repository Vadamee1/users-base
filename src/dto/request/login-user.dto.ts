import { IsString, IsEmail } from 'class-validator';

export class LoginUser {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
