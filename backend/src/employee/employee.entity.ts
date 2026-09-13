import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Admin } from '../admin/entities/admin.entity.js';

export enum EmployeeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  position: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.PENDING,
    })
  status: EmployeeStatus;

  @ManyToOne('Admin', (admin: Admin) => admin.employees, { nullable: true })
  @JoinColumn({ name: 'approvedByAdminId' })
  approvedByAdmin: Admin;
}