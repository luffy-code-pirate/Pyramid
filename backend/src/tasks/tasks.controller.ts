import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../auth/current-user.decorator';
import { TaskStatus } from './task.entity';

// @UseGuards at the CONTROLLER level (not per-route) means every
// single route in this controller requires a valid login session.
// No task route is ever public.
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET /tasks              -> all of my tasks
  // GET /tasks?status=done  -> only my "done" tasks
  @Get()
  findAll(
    @CurrentUserId() userId: string,
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.findAllForUser(userId, status);
  }

  // GET /tasks/:id -> a single task (only if I own it)
  @Get(':id')
  findOne(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.tasksService.findOneForUser(id, userId);
  }

  // POST /tasks -> create a new task
  @Post()
  create(@CurrentUserId() userId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(userId, dto);
  }

  // PATCH /tasks/:id -> partially update a task
  @Patch(':id')
  update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, userId, dto);
  }

  // DELETE /tasks/:id -> remove a task
  @Delete(':id')
  remove(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.tasksService.remove(id, userId);
  }
}