import { IsEmail, IsString, MinLength } from 'class-validator';

// Used for POST /auth/login
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}