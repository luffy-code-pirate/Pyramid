'use client';

import { useState } from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onCreate: (status: TaskStatus, title: string) => Promise<void>;
}

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'Doing' },
  { status: 'done', label: 'Completed' },
];

export function TaskBoard({ tasks, onDelete, onCreate }: TaskBoardProps) {
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState('');

  async function handleAdd(status: TaskStatus) {
    if (!newTitle.trim()) {
      setAddingTo(null);
      return;
    }
    await onCreate(status, newTitle.trim());
    setNewTitle('');
    setAddingTo(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);

        return (
          <div
            key={column.status}
            className="flex-1 min-w-[260px] bg-surface rounded-xl p-3"
          >
            <div className="flex items-center gap-2 px-1 mb-3">
              <span className="text-sm font-semibold text-foreground">
                {column.label}
              </span>
              <span className="text-xs text-muted">({columnTasks.length})</span>
            </div>

            <div className="flex flex-col gap-2">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} onDelete={onDelete} />
              ))}
            </div>

            <div className="mt-2">
              {addingTo === column.status ? (
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdd(column.status);
                    if (e.key === 'Escape') setAddingTo(null);
                  }}
                  onBlur={() => handleAdd(column.status)}
                  placeholder="Task title..."
                  className="w-full text-sm bg-background border border-border rounded-lg px-2 py-1.5 outline-none text-foreground placeholder:text-muted"
                />
              ) : (
                <button
                  onClick={() => setAddingTo(column.status)}
                  className="text-xs text-muted hover:text-foreground px-1"
                >
                  + Add Task
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}