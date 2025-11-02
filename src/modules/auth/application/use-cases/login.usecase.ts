import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '../../../users/domain/ports/user.repository';
import type { IAuthService } from '../../domain/ports/auth.service';
import { ApiResponse } from '../../../../shared/kernel/response.interface';
import { createResponse } from '../../../../shared/kernel/response.util';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: IUserRepository,
    @Inject('AuthService') private readonly authService: IAuthService,
  ) {}

  async execute(email: string, password: string): Promise<ApiResponse<any>> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return createResponse('error', 'Usuario no encontrado');

    if (!user.password || user.password === '' || !user.id)
      return createResponse('error', 'Contraseña no encontrada');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return createResponse(
        'error',
        'Credenciales no válidas. Por favor, verifica tu correo y contraseña.',
      );

    const token = this.authService.generateToken({
      userId: user.id.toString(),
      email: user.email!,
    });

    return createResponse('success', 'Login exitoso', {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  }
}
