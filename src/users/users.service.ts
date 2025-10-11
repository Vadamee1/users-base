import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { SALT_ROUNDS } from '../config/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser({ username, email, password }: CreateUserDto) {
    try {
      const saltRounds = parseInt(SALT_ROUNDS ?? '10');

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      return this.prisma.users.create({
        data: {
          user_name: username,
          email,
          password: hashedPassword,
          deleted: new Date().toISOString(),
        },
      });
    } catch (error) {
      throw new Error('Error creating user ', error);
    }
  }

  findUserByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }
}
