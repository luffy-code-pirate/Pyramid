import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// Used for POST /auth/guest
// A guest only needs to provide a display name — nothing else.
export class GuestLoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  name: string;
}