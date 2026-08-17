import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { GuestLoginDto } from './dto/guest-login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUserId } from './current-user.decorator';
import { UsersService } from '../users/users.service';

// Shared cookie settings for every login-type response.
const COOKIE_OPTIONS = {
  httpOnly: true, // JavaScript in the browser CANNOT read this cookie — blocks XSS token theft
  sameSite: 'lax' as const, // basic CSRF protection
  secure: process.env.NODE_ENV === 'production', // HTTPS-only in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches our JWT expiry
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // POST /auth/guest — creates a guest account, logs them in immediately
  @Post('guest')
  async guestLogin(
    @Body() dto: GuestLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginAsGuest(dto.name);
    // 'passthrough: true' lets us set a cookie AND still let NestJS
    // handle the response body automatically (instead of manually
    // calling res.json() ourselves).
    res.cookie('access_token', result.accessToken, COOKIE_OPTIONS);
    return { user: result.user };
  }

  // POST /auth/register — create a real account
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto.name, dto.email, dto.password);
    res.cookie('access_token', result.accessToken, COOKIE_OPTIONS);
    return { user: result.user };
  }

  // POST /auth/login — log into an existing account
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.email, dto.password);
    res.cookie('access_token', result.accessToken, COOKIE_OPTIONS);
    return { user: result.user };
  }

  // POST /auth/logout — clear the session cookie
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { success: true };
  }

  // GET /auth/me — "who am I currently logged in as?"
  // Protected by our guard — only works if a valid cookie is present.
  // The frontend calls this on page load to restore the session.
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUserId() userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) return { user: null };
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest,
        theme: user.theme,
      },
    };
  }
}