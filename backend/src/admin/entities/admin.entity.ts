import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import type { AdminSettings } from './admin-settings.entity.js';
import { OneToMany } from 'typeorm';   // add to your existing typeorm imports
import type { Employee } from '../../employee/employee.entity.js';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne('AdminSettings', (settings: AdminSettings) => settings.admin, {
    cascade: true,
    eager: true,
  })
  @OneToMany('Employee', (employee: Employee) => employee.approvedByAdmin)
  employees: Employee[];
  settings: AdminSettings;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}