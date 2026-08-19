import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me/theme')
  async updateTheme(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateThemeDto,
  ) {
    const user = await this.usersService.updateTheme(userId, dto);
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