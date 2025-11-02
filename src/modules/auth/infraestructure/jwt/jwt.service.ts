import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../../domain/ports/auth.service';

@Injectable()
export class JwtAuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: { userId: string; email: string }): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
