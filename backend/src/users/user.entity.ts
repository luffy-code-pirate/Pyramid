import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';

export enum ThemePreference {
  LIGHT = 'light',
  DARK = 'dark',
}

// The accent color options shown in the Figma's "Color Mode" menu.
export enum ColorMode {
  AMBER = 'amber',
  BLUE = 'blue',
  PINK = 'pink',
  ROSE = 'rose',
  EMERALD = 'emerald',
  BLACK = 'black',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column()
  name: string;

  @Column({ default: false })
  isGuest: boolean;

  @Column({ type: 'varchar', default: ThemePreference.LIGHT })
  theme: ThemePreference;

  // New: accent color, independent of light/dark mode.
  // Defaults to Blue, matching what the Figma design shows
  // as the default selected option.
  @Column({ type: 'varchar', default: ColorMode.BLUE })
  colorMode: ColorMode;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];
}