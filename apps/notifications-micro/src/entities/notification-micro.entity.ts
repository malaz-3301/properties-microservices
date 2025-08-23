import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users-micro/src/users/entities/user.entity';
import { Property } from '../../../properties-micro/src/properties/entities/property.entity';

@Entity('notification')
export class NotificationMicro {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.notificationMicros)
  user: User;
  @Column({ type: 'jsonb' })
  usre_language_message: string;
  @CreateDateColumn({ type: 'timestamp', nullable: true, default: null })
  readAt: Date | null;
  @ManyToOne(() => Property, (property) => property.notificationMicros)
  property: Property;
  @Column()
  title: string;
}
