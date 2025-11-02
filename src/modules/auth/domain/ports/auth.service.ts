export interface IAuthService {
  generateToken(payload: { userId: string; email: string }): string;
  verifyToken(token: string): any;
}
