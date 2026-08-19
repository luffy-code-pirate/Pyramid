'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/use-tasks';
import { Task, TaskStatus } from '@/lib/types';
import { PriorityBadge } from '@/components/PriorityBadge';
import { TaskBoard } from '@/components/TaskBoard';

const STATUS_GROUPS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'Doing' },
  { status: 'done', label: 'Completed' },
];

type ViewMode = 'list' | 'board';

export default function TasksPage() {
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks();
  const [view, setView] = useState<ViewMode>('list');

  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState('');

  async function handleAddTask(status: TaskStatus) {
    if (!newTitle.trim()) {
      setAddingTo(null);
      return;
    }
    await createTask({ title: newTitle.trim(), status });
    setNewTitle('');
    setAddingTo(null);
  }

  async function handleStatusChange(task: Task, newStatus: TaskStatus) {
    await updateTask(task.id, { status: newStatus });
  }

  async function handleBoardCreate(status: TaskStatus, title: string) {
    await createTask({ title, status });
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted text-sm">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Tasks</h1>

        <div className="flex items-center bg-surface border border-border rounded-lg p-0.5">
          <button
            onClick={() => setView('list')}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              view === 'list'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('board')}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              view === 'board'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted'
            }`}
          >
            Board
          </button>
        </div>
      </div>

      {view === 'board' ? (
        <TaskBoard tasks={tasks} onDelete={deleteTask} onCreate={handleBoardCreate} />
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          {STATUS_GROUPS.map((group, groupIndex) => {
            const groupTasks = tasks.filter((t) => t.status === group.status);

            return (
              <div
                key={group.status}
                className={groupIndex > 0 ? 'border-t border-border' : ''}
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-surface">
                  <span className="text-sm font-semibold text-foreground">
                    {group.label}
                  </span>
                  <span className="text-xs text-muted">({groupTasks.length})</span>
                </div>

                {groupTasks.length > 0 && (
                  <div className="flex items-center gap-4 px-4 py-2 text-xs text-muted border-t border-border">
                    <span className="flex-1">Task</span>
                    <span className="w-24">Priority</span>
                    <span className="w-28">Due Date</span>
                    <span className="w-16 text-right">Actions</span>
                  </div>
                )}

                {groupTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 px-4 py-3 border-t border-border hover:bg-surface transition-colors"
                  >
                    <Link
                      href={`/tasks/${task.id}`}
                      className="flex-1 text-sm text-foreground truncate hover:underline"
                    >
                      {task.title}
                    </Link>
                    <span className="w-24">
                      <PriorityBadge priority={task.priority} />
                    </span>
                    <span className="w-28 text-xs text-muted">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                          })
                        : '—'}
                    </span>
                    <span className="w-16 flex justify-end gap-2">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task, e.target.value as TaskStatus)
                        }
                        className="text-xs bg-transparent border border-border rounded px-1 py-0.5 text-foreground"
                        aria-label={`Change status for ${task.title}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">Doing</option>
                        <option value="done">Completed</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-xs text-red-500 hover:underline"
                        aria-label={`Delete ${task.title}`}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                ))}

                <div className="px-4 py-2 border-t border-border">
                  {addingTo === group.status ? (
                    <input
                      autoFocus
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTask(group.status);
                        if (e.key === 'Escape') setAddingTo(null);
                      }}
                      onBlur={() => handleAddTask(group.status)}
                      placeholder="Task title..."
                      className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted"
                    />
                  ) : (
                    <button
                      onClick={() => setAddingTo(group.status)}
                      className="text-sm text-muted hover:text-foreground"
                    >
                      + Add Task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}