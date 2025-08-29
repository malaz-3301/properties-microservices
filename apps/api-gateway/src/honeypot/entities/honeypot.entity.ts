import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '@malaz/contracts/utils/constants';

@Entity('honeypot')
export class Honeypot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  ip: string;

  @Column({ type: 'text', nullable: true })
  x_forwarded_for?: string;

  @Column({ type: 'text', nullable: true })
  user_agent?: string;

  @Column()
  path: string;

  @Column({ length: 8 })
  method: string;

  @Column({ type: 'jsonb', nullable: true })
  headers?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  first_seen: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  last_seen: Date;
}
