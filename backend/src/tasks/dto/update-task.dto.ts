import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// PartialType takes every field from CreateTaskDto and makes them
// ALL optional — perfect for PATCH requests, where a user might
// only want to update one field (like just the status) without
// resending the entire task.
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}