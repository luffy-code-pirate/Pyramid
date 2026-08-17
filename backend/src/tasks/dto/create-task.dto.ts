import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../tasks/task.entity';

// Used for POST /tasks — creating a new task.
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  // Optional — a task can be created with just a title.
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  // Optional — defaults to TODO in the entity if not provided.
  // @IsEnum checks the value is one of our TaskStatus enum values.
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  // @IsDateString expects an ISO date string like "2026-08-20".
  // We accept it as a string over the wire (JSON has no native
  // date type) and convert it to a real Date in the service.
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}