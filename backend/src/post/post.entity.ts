import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Product } from '../product/product.entity.js';

@Entity()
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

  @ManyToOne(() => Product, (product) => product.posts)
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Column()
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}