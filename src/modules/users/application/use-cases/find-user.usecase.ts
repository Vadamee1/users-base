import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository';
import { ApiResponse } from '../../../../shared/kernel/response.interface';
import { createResponse } from '../../../../shared/kernel/response.util';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<ApiResponse<object | null>> {
    const user = await this.userRepository.findById(id);
    if (!user) return createResponse('error', 'Usuario no encontrado.');
    return createResponse('success', 'Usuario encontrado.', {
      user: {
        username: user.username,
        email: user.email,
      },
    });
  }
}
