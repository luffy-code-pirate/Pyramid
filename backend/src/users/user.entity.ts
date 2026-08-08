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

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];
}