import { Task } from '@/lib/types';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

// A single card used in the Board view — matches the Figma's
// Kanban card style: title, priority, due date, quick delete.
export function TaskCard({ task, onDelete }: TaskCardProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-3 hover:shadow-sm transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-foreground font-medium leading-snug">
          {task.title}
        </p>
        {/* Delete button only shows on hover — keeps cards visually
            clean until the user actually needs the action. */}
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          aria-label={`Delete ${task.title}`}
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="text-xs text-muted">
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
            })}
          </span>
        )}
      </div>
    </div>
  );
}