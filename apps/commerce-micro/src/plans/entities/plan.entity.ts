import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from '../../orders/entities/order.entity';
import { PlanType } from '@malaz/contracts/utils/enums';
import { User } from '../../../../users-micro/src/users/entities/user.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 14 })
  planDuration: string;

  @Column({ type: 'jsonb' })
  multi_description: string;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.BASIC,
  })
  planType: PlanType;

  @Column({ type: 'numeric', precision: 4, scale: 2 })
  planPrice: number;

  @Column({ type: 'integer', default: 1 })
  limit: number;

  @OneToMany(() => Order, (order: Order) => order.plan)
  orders: Order[];

  @OneToMany(() => User, (user: User) => user.plan)
  users: User[];
}
