import { TaskPriority } from '@/lib/types';

// Maps each priority to a color and label, matching the Figma's
// colored priority indicators (red=high, orange/amber=medium, gray=low).
const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  high: { label: 'High', color: '#ef4444' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low: { label: 'Low', color: '#a3a3a3' },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium"
      style={{ color: config.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}