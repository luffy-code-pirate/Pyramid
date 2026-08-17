import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

// The shape of data we send back after any successful login/register.
// Notice: no password field here — we NEVER send password data back,
// even the hashed version, to the frontend.
export interface AuthResult {
  user: Pick<User, 'id' | 'name' | 'email' | 'isGuest' | 'theme'>;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Shared helper: given a User row, sign a JWT and shape the response.
  // 'sub' (subject) is the standard JWT field for "who is this token about."
  private toResult(user: User): AuthResult {
    const accessToken = this.jwtService.sign({ sub: user.id });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest,
        theme: user.theme,
      },
      accessToken,
    };
  }

  // Guest login: no credentials needed, just create a fresh guest
  // account and immediately log them in.
  async loginAsGuest(name: string): Promise<AuthResult> {
    const guest = await this.usersService.createGuest(name);
    return this.toResult(guest);
  }

  // Register: check the email isn't already taken, hash the password
  // (NEVER store plain text), create the user, then log them in.
  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    // bcrypt.hash's second argument (10) is the "salt rounds" —
    // higher = more secure but slower. 10 is a solid default.
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.createRegistered(name, email, hashed);
    return this.toResult(user);
  }

  // Login: find the user, compare the submitted password against
  // the stored hash (bcrypt.compare, never a direct string match),
  // and return a token if it matches.
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