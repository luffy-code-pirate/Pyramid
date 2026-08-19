// These types mirror our NestJS backend's entities and DTOs.
// Keeping them in one place means every component that touches
// User or Task data agrees on the exact same shape.

export type ThemePreference = 'light' | 'dark';
export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

export interface User {
  id: string;
  name: string;
  email: string | null;
  isGuest: boolean;
  theme: ThemePreference;
  colorMode: ColorMode;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // ISO date string over the wire
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Shape of data sent when creating a task — matches our
// backend's CreateTaskDto. Notice everything except title
// is optional, same rule enforced server-side.
export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

// For updates, every field is optional — matches UpdateTaskDto's
// PartialType behavior on the backend.
export type UpdateTaskInput = Partial<CreateTaskInput>;