import { Module } from '@nestjs/common';
import { UsersController } from './infraestructure/controllers/users.controller';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { FindUserUseCase } from './application/use-cases/find-user.usecase';
import { UserRepository } from './infraestructure/repositories/prisma-user.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_JWT_KEY,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    CreateUserUseCase,
    FindUserUseCase,
  ],
  exports: [],
})
export class UsersModule {}
