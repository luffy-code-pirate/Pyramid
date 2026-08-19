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

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('guest')
  async guestLogin(
    @Body() dto: GuestLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginAsGuest(dto.name);
    res.cookie('access_token', result.accessToken, COOKIE_OPTIONS);
    return { user: result.user };
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto.name, dto.email, dto.password);
    res.cookie('access_token', result.accessToken, COOKIE_OPTIONS);
    return { user: result.user };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.email, dto.password);
    res.cookie('access_token', result.accessToken, COOKIE_OPTIONS);
    return { user: result.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { success: true };
  }

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
        colorMode: user.colorMode,
      },
    };
  }
}