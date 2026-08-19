'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Task, TaskStatus, TaskPriority } from '@/lib/types';
import { Button } from '@/components/Button';

export default function TaskDetailPage() {
  // useParams reads the [id] segment from the URL — e.g. visiting
  // /tasks/abc-123 gives us { id: 'abc-123' } here.
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Local editable copies of each field. We don't edit `task`
  // directly — that way, if a save fails, the displayed data
  // hasn't been silently corrupted.
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await api.get<Task>(`/tasks/${id}`);
        setTask(data);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setStatus(data.status);
        setPriority(data.priority);
        // Convert ISO datetime to YYYY-MM-DD for the date input.
        setDueDate(data.dueDate ? data.dueDate.split('T')[0] : '');
      } catch {
        setError('Task not found, or you don\'t have access to it.');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchTask();
  }, [id]);

  async function handleSave() {
    setIsSaving(true);
    setError('');
    try {
      const updated = await api.patch<Task>(`/tasks/${id}`, {
        title,
        description: description || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
      });
      setTask(updated);
    } catch {
      setError('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/tasks/${id}`);
      router.push('/tasks');
    } catch {
      setError('Failed to delete task.');
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted text-sm">Loading task...</p>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={() => router.push('/tasks')}
          className="text-sm text-muted hover:text-foreground mt-2"
        >
          ← Back to tasks
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <button
        onClick={() => router.push('/tasks')}
        className="text-sm text-muted hover:text-foreground mb-4"
      >
        ← Back to tasks
      </button>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-semibold text-foreground bg-transparent outline-none mb-2"
        placeholder="Task title"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        rows={4}
        className="w-full text-sm text-foreground bg-transparent outline-none resize-none border border-border rounded-lg p-3 mb-6 placeholder:text-muted"
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-muted block mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">Doing</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
          />
        </div>

        {task && (
          <div>
            <label className="text-xs text-muted block mb-1">Created</label>
            <p className="text-sm text-foreground py-2">
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-4" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="secondary" onClick={handleDelete}>
          Delete Task
        </Button>
      </div>
    </div>
  );
}