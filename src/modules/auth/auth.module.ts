import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './infraestructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { JwtAuthService } from './infraestructure/jwt/jwt.service';
import { UserRepository } from '../users/infraestructure/repositories/prisma-user.repository';
import { PrismaService } from 'src/shared/infraestructure/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_JWT_KEY,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    LoginUseCase,
    {
      provide: 'AuthService',
      useClass: JwtAuthService,
    },
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [LoginUseCase],
})
export class AuthModule {}
