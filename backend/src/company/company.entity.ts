import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Product } from '../product/product.entity.js';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  companyName: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column()
  industryId: number;

  @Column({ nullable: true, length: 150 })
  location?: string;

  @Column({ nullable: true, length: 255 })
  website?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ nullable: true, length: 255 })
  logo?: string;

  @Column({ nullable: true, length: 20 })
  phone?: string;

  @Column({ default: false })
  isSubscribe: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @OneToMany('Product', (product: Product) => product.company)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}