import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { FindUserUseCase } from '../../application/use-cases/find-user.usecase';
import { JwtAuthGuard } from 'src/shared/infraestructure/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.createUserUseCase.execute(createUserDto);
    if (result.messages[0].type === 'success') return result;
    throw new HttpException(result, HttpStatus.CONFLICT);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    const result = await this.findUserUseCase.execute(id);
    if (result.messages[0].type === 'success') return result;
    throw new HttpException(result, HttpStatus.NOT_FOUND);
  }

  @Patch(':id/username')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number) {
    console.log('update', id);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updatePassword(@Param('id') id: number) {
    console.log('updatePassword', id);
  }
}
