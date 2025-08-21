import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Property } from '../../properties/entities/property.entity';
import { User } from '../../../../users-micro/src/users/entities/user.entity';

@Entity('views')
export class View {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property, (property) => property.views)
  property: Property;

  @ManyToOne(() => User, (user) => user.views)
  user: User;
}
