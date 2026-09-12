import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Company } from '../company/company.entity.js';

@Entity('industries')
export class Industry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  industryName: string;

  @OneToMany(() => Company, (company) => company.industry)
  companies: Relation<Company[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}