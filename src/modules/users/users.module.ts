import { Module } from '@nestjs/common';
import { UsersController } from './api/controllers/users.controller';
import { PrismaService } from '../../shared/infra/prisma/prisma.service';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { UserRepository } from './infraestructure/repositories/prisma-user.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    CreateUserUseCase,
  ],
  exports: [],
})
export class UsersModule {}
