import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { createResponse } from 'src/shared/kernel/response.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request & { user?: any } = context.switchToHttp().getRequest();

    // 1) Obtener token desde header Authorization (preferido para APIs)
    const authHeader = req.headers?.authorization;
    let token: string | undefined;

    if (
      authHeader &&
      typeof authHeader === 'string' &&
      authHeader.startsWith('Bearer ')
    ) {
      token = authHeader.slice(7).trim();
    }

    // 2) Si no viene por header, intentar desde cookies (NextAuth cookie names)
    if (!token) {
      // req.cookies puede ser undefined si no usas cookie-parser
      if (req.cookies && typeof req.cookies === 'object') {
        token =
          (req.cookies['next-auth.session-token'] as string) ||
          (req.cookies['__Secure-next-auth.session-token'] as string);
      } else if (
        req.headers?.cookie &&
        typeof req.headers.cookie === 'string'
      ) {
        // parseo simple de cookie sin dependencia externa
        token =
          this.getCookieFromHeader(
            req.headers.cookie,
            'next-auth.session-token',
          ) ||
          this.getCookieFromHeader(
            req.headers.cookie,
            '__Secure-next-auth.session-token',
          );
      }
    }

    if (!token) {
      const errorMsgToken = createResponse(
        'error',
        'Token no encontrado',
        null,
      );
      throw new HttpException(errorMsgToken, HttpStatus.UNAUTHORIZED);
    }

    const configSecret = this.configService.get<string>('NEXTAUTH_SECRET');
    console.log(configSecret);

    if (!configSecret) {
      // Es un error de configuración en el servidor
      const errorMsgSecret = createResponse(
        'error',
        'Secret no encontrado',
        null,
      );
      throw new HttpException(errorMsgSecret, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      // Verificar token; ajusta opciones según tu algoritmo (HS256 por defecto)
      const payload: object | null = this.jwtService.verify(token, {
        secret: configSecret,
      });

      // Opcional: validar estructura del payload
      if (!payload || typeof payload !== 'object') {
        const invalidTokenMsg = createResponse('error', 'Token inválido', null);
        throw new HttpException(invalidTokenMsg, HttpStatus.UNAUTHORIZED);
      }

      // Adjuntar usuario al request para que controladores lo usen
      return true;
    } catch (err) {
      console.log(err);
      const response = createResponse('error', 'Token inválido', null);
      throw new HttpException(response, HttpStatus.UNAUTHORIZED);
    }
  }

  private getCookieFromHeader(
    cookieHeader: string,
    name: string,
  ): string | undefined {
    const match = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`));
    if (!match) return undefined;
    return decodeURIComponent(match.split('=').slice(1).join('='));
  }
}
