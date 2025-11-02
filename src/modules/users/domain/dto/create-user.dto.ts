import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  username: string;

  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}
