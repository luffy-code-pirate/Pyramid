import { TaskStatus } from '@/lib/types';

const STATUS_CONFIG: Record<TaskStatus, { label: string }> = {
  todo: { label: 'To Do' },
  in_progress: { label: 'Doing' },
  done: { label: 'Completed' },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="text-sm font-medium text-foreground">
      {STATUS_CONFIG[status].label}
    </span>
  );
}