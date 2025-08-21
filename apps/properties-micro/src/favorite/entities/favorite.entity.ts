

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { User } from '../../../../users-micro/src/users/entities/user.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property, (property) => property.favorites, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;
}
