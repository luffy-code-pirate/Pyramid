import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // Registers the Task entity's repository — required for
    // @InjectRepository(Task) inside TasksService to work.
    TypeOrmModule.forFeature([Task]),

    // TasksController uses JwtAuthGuard, which needs JwtService
    // to verify tokens — importing AuthModule gives us access to
    // that (AuthModule exports JwtModule and JwtAuthGuard already).
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
