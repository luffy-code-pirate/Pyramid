import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // NestJS calls this method automatically for any route
  // decorated with @UseGuards(JwtAuthGuard).
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Read the token from the cookie named 'access_token'.
    // This requires cookie-parser middleware to be set up in
    // main.ts — otherwise request.cookies would be undefined.
    const token = request.cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      // Verifies the token's signature AND checks it hasn't expired.
      // Throws automatically if either check fails.
      const payload = this.jwtService.verify<{ sub: string }>(token);

      // Attach the user's ID onto the request object so route
      // handlers can access "who is making this request" without
      // re-verifying the token themselves.
      (request as any).userId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}