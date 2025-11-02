import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.createUserUseCase.execute(createUserDto);
    if (result.messages[0].type === 'success') return result;
    throw new HttpException(result, HttpStatus.CONFLICT);
  }
}
