import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  // Returns all tasks belonging to a specific user, optionally
  // filtered by status (e.g. only "done" tasks for a filter view).
  findAllForUser(ownerId: string, status?: TaskStatus): Promise<Task[]> {
    return this.tasksRepository.find({
      where: status ? { ownerId, status } : { ownerId },
      order: { createdAt: 'DESC' }, // newest first
    });
  }

  // Finds ONE task, but critically also checks ownership.
  // This is the key security boundary: even if someone knows
  // another user's task ID, they can't read or modify it.
  async findOneForUser(id: string, ownerId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.ownerId !== ownerId) throw new ForbiddenException('Not your task');
    return task;
  }

  // Creates a new task, always attached to the currently
  // logged-in user (never trust a client-supplied ownerId).
  create(ownerId: string, dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      ownerId,
    });
    return this.tasksRepository.save(task);
  }

  // Updates a task — reuses findOneForUser so ownership is
  // ALWAYS re-checked before any update happens.
  async update(id: string, ownerId: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOneForUser(id, ownerId);
    Object.assign(task, {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : task.dueDate,
    });
    return this.tasksRepository.save(task);
  }

  // Deletes a task — same ownership check applies here too.
  async remove(id: string, ownerId: string): Promise<void> {
    const task = await this.findOneForUser(id, ownerId);
    await this.tasksRepository.remove(task);
  }
}