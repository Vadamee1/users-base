import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../../../config/configuration';
import type { IUserRepository } from '../../domain/ports/user.repository';
import { ApiResponse } from '../../../../shared/kernel/response.interface';
import { createResponse } from '../../../../shared/kernel/response.util';

interface User {
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,

    private configService: ConfigService,
  ) {}

  async execute(user: User): Promise<ApiResponse<null>> {
    const userExists = await this.userRepository.findByEmail(user.email);

    if (userExists)
      return createResponse(
        'error',
        'Ya existe un usuario registrado con el mismo correo electrónico.',
      );

    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    const createdUser = await this.userRepository.create({
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });

    if (!createdUser)
      return createResponse('error', 'Error al crear el usuario');

    return createResponse('success', 'Usuario creado exitosamente');
  }
}
