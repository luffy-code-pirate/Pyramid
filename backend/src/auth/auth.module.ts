import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // forwardRef solves a circular dependency: AuthModule needs
    // UsersModule (to create/find users), and later UsersModule
    // will need AuthModule too (for a JWT guard on its routes).
    // forwardRef lets both modules reference each other safely.
    forwardRef(() => UsersModule),

    // registerAsync lets us pull the JWT secret from our .env file
    // via ConfigService, instead of hardcoding it in this file.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'dev-secret-change-me',
        signOptions: { expiresIn: '7d' }, // sessions last 7 days
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  // Exporting JwtModule lets other modules (like UsersModule, for
  // its guard) verify tokens too, without redefining JWT config.
  exports: [JwtModule],
})
export class AuthModule {}