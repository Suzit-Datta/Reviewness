import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import type { Admin } from './admin.entity.js';

@Entity('admin_settings')
export class AdminSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: true })
  emailNotifications: boolean;

  @OneToOne('Admin', (admin: Admin) => admin.settings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}