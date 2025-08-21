import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CURRENT_TIMESTAMP } from '@malaz/contracts/utils/constants';


@Entity('banned')
export class Banned {
  @PrimaryColumn()
  user_id: number;

  @OneToOne(() => User, (user) => user.banned, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 80 })
  reason: string;

  @Column({ type: 'timestamp', nullable: true })
  banExpiresAt?: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
}
