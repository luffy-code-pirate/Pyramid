import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  // This registers the User entity's repository with this module,
  // which is what allows @InjectRepository(User) inside UsersService
  // to actually receive a working repository instance.
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  // Exporting UsersService lets other modules (like AuthModule)
  // import UsersModule and use this service.
  exports: [UsersService],
})
export class UsersModule {}