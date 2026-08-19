import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

export interface AuthResult {
  user: Pick<User, 'id' | 'name' | 'email' | 'isGuest' | 'theme' | 'colorMode'>;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private toResult(user: User): AuthResult {
    const accessToken = this.jwtService.sign({ sub: user.id });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest,
        theme: user.theme,
        colorMode: user.colorMode,
      },
      accessToken,
    };
  }

  async loginAsGuest(name: string): Promise<AuthResult> {
    const guest = await this.usersService.createGuest(name);
    return this.toResult(guest);
  }

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.createRegistered(name, email, hashed);
    return this.toResult(user);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.toResult(user);
  }
}