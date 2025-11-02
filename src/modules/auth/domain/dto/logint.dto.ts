import { IsEmail, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}
