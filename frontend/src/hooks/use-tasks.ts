'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types';

// A single hook that owns: fetching tasks, creating, updating,
// deleting, and keeping local state in sync after each mutation.
// Any component that needs task data uses this hook instead of
// calling the API directly — keeps data-fetching logic in one place.
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.get<Task[]>('/tasks');
      setTasks(data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch once when the hook is first used.
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function createTask(input: CreateTaskInput) {
    const newTask = await api.post<Task>('/tasks', input);
    // Add the new task to local state immediately, rather than
    // re-fetching the whole list — faster UI feedback.
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }

  async function updateTask(id: string, input: UpdateTaskInput) {
    const updated = await api.patch<Task>(`/tasks/${id}`, input);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async function deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return { tasks, isLoading, error, createTask, updateTask, deleteTask, refetch: fetchTasks };
}