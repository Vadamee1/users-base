import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { AuthLoginDto } from '../../domain/dto/logint.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: AuthLoginDto) {
    const result = await this.loginUseCase.execute(email, password);
    if (result.messages[0].type === 'success') return result;
    throw new HttpException(result, HttpStatus.UNAUTHORIZED);
  }
}
