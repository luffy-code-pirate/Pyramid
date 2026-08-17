import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// Used for POST /auth/register
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  name: string;

  // @IsEmail automatically validates proper email format
  @IsEmail()
  email: string;

  // Minimum 6 characters — a basic rule, easy to strengthen later
  @IsString()
  @MinLength(6)
  password: string;
}