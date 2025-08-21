import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Plan } from '../../plans/entities/plan.entity';
import { OrderStatus } from '@malaz/contracts/utils/enums';
import { CURRENT_TIMESTAMP } from '@malaz/contracts/utils/constants';
import { User } from '../../../../users-micro/src/users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ACTIVE })
  planStatus: OrderStatus;

  @Column({ type: 'timestamp', nullable: true })
  planExpiresAt?: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Plan, (plan: Plan) => plan.orders)
  plan: Plan;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
}
