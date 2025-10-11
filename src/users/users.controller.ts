import { Body, Controller, Post, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/request';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() { username, email, password }: CreateUserDto,
    @Res() res: Response,
  ) {
    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        messages: [
          {
            text: 'Los datos recibidos no son válidos.',
            type: 'error',
          },
        ],
      });
    }

    const existingUser = await this.usersService.findUserByEmail(email);

    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({
        data: null,
        messages: [
          {
            text: 'Ya existe un usuario registrado con el mismo correo electrónico.',
            type: 'error',
          },
        ],
      });
    }

    const user = { username, email, password };

    await this.usersService.createUser(user);

    return res.status(HttpStatus.CREATED).json({
      data: null,
      messages: [
        {
          text: 'Felicidades se ha creado el usuario correctamente.',
          type: 'success',
        },
      ],
    });
  }
}
