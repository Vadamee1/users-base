import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user.repository';
import { User } from '../../domain/entities/user.entity';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { CreateUserDto } from '../../domain/dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}
  findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  create({ username, email, password }: CreateUserDto): Promise<User | null> {
    return this.prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
  }
}
