import { IsEnum, IsOptional } from 'class-validator';
import { ThemePreference, ColorMode } from '../user.entity';

// Used for PATCH /users/me/theme
// Both fields are optional so the frontend can update either
// one independently — e.g. just switching Light/Dark without
// touching the accent color, or vice versa.
export class UpdateThemeDto {
  @IsOptional()
  @IsEnum(ThemePreference)
  theme?: ThemePreference;

  @IsOptional()
  @IsEnum(ColorMode)
  colorMode?: ColorMode;
}