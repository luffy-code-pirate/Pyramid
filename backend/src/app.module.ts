import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Makes environment variables (like secrets) available
    // app-wide via ConfigService, without importing this
    // module into every single file that needs them.
    ConfigModule.forRoot({ isGlobal: true }),

    // This is where TypeORM actually connects to our database.
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH || 'db.sqlite',
      entities: [User, Task],
      // 'synchronize: true' means TypeORM auto-creates/updates
      // database tables to match our entity classes. Convenient
      // for development — in a real production app you'd use
      // proper migrations instead, since this can be destructive.
      synchronize: true,
    }),

    AuthModule,

    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}