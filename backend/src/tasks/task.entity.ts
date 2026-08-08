import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

// The three states a task can be in. Matches a typical
// To Do / In Progress / Done board layout — adjust these
// later if your Figma design uses different column names.
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

// Priority levels — useful for sorting/filtering and for
// showing colored priority tags in the UI.
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Required — every task needs a title.
  @Column()
  title: string;

  // Optional longer description. 'text' type allows longer content
  // than a normal varchar column.
  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Defaults every new task to TODO unless specified otherwise.
  @Column({ type: 'varchar', default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: 'varchar', default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  // Optional deadline. Nullable because not every task needs one.
  @Column({ type: 'datetime', nullable: true })
  dueDate: Date | null;

  // The OTHER side of the relationship defined in User.
  // @ManyToOne means: many tasks can belong to one user.
  // onDelete: 'CASCADE' means if a user is deleted, their tasks
  // get deleted automatically too (no orphaned tasks left behind).
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  // The actual foreign key column stored in the database
  // (a plain string pointing to a User's id). Having this as its
  // own column makes queries like "find tasks where ownerId = X"
  // fast, without always loading the full User object.
  @Column()
  ownerId: string;

  // Auto-set when the task is first created.
  @CreateDateColumn()
  createdAt: Date;

  // Auto-updated every time the task row changes (e.g. status flips
  // from 'todo' to 'done'). Useful for sorting by "recently updated."
  @UpdateDateColumn()
  updatedAt: Date;
}