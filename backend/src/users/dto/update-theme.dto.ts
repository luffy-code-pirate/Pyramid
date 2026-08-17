import { IsEnum } from 'class-validator';
import { ThemePreference } from '../user.entity';

// Used for PATCH /users/me/theme
export class UpdateThemeDto {
  // Ensures the value sent is EXACTLY 'light' or 'dark' —
  // nothing else gets through validation.
  @IsEnum(ThemePreference)
  theme: ThemePreference;
}