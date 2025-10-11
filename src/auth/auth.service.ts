import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SECRET_JWT_KEY } from '../config/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async validateUser(email: string, password: string): Promise<object | null> {
    try {
      const user = await this.findUserByEmail(email);

      if (!user) return null;

      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        user?.password ?? '',
      );

      if (!isPasswordValid) return null;

      const tokenPayload = { email: user.email, sub: user.id };

      const token = await this.jwtService.signAsync(tokenPayload, {
        secret: SECRET_JWT_KEY,
        expiresIn: '1h',
      });

      return { token };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to validate user');
    }
  }

  async signOut(token: string) {
    await this.jwtService.verifyAsync(token, {
      secret: SECRET_JWT_KEY,
    });
  }
}
