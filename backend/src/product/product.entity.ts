import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Post } from '../post/post.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column()
  companyId: number;

  @Column()
  categoryId: number;

  @OneToMany(() => Post, (post) => post.product)
  posts: Relation<Post[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}