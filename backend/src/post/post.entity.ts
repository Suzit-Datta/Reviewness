import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../users/user.entity.js';

import { Product } from '../product/product.entity.js';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  caption: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  rating: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  image?: string;

  @Column()
  userId: number;

  @Column()
  companyId: number;

  @Column()
  categoryId: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.posts)
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}