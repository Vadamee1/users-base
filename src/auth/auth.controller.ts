import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUser } from '../dto/request';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginUser, @Res() res: Response) {
    if (body === null || body === undefined) {
      return res.status(400).json({
        data: null,
        messages: [
          {
            text: 'Credenciales no válidas. Por favor, verifica tu correo y contraseña.',
            type: 'error',
          },
        ],
      });
    }
    const response = await this.authService.validateUser(
      body.email,
      body.password,
    );

    if (!response) {
      return res.status(401).json({
        data: null,
        messages: [
          {
            text: 'Credenciales no válidas. Por favor, verifica tu correo y contraseña.',
            type: 'error',
          },
        ],
      });
    }

    return res.status(200).json({
      data: {
        token: (response as { token: string }).token,
      },
      messages: [],
    });
  }
}
