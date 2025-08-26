import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Location } from '../../geolocation/entities/location.embedded';

import { Favorite } from '../../favorite/entities/favorite.entity';
import { Estate } from './estate.entity';
import { Vote } from '../../votes/entities/vote.entity';
import { View } from '../../views/entities/view.entity';
import { PriorityRatio } from './priority-ratio.entity';
import { User } from '../../../../users-micro/src/users/entities/user.entity';
import { PropertyStatus } from '@malaz/contracts/utils/enums';
import { CURRENT_TIMESTAMP } from '@malaz/contracts/utils/constants';
import { Contract } from '../../../../users-micro/src/contracts/entities/contract.entity';
import { NotificationMicro } from '../../../../notifications-micro/src/entities/notification-micro.entity';

@Entity('property')
export abstract class Property extends Estate {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Favorite, (favorites) => favorites.property, {
    cascade: true,
  })
  favorites?: Favorite[];

  @OneToMany(() => Vote, (vote) => vote.property, { cascade: true })
  votes?: Vote[];

  @OneToMany(() => View, (view) => view.property, { cascade: true })
  views?: View[];

  @ManyToOne(() => User, (user: User) => user.ownerProperties, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @ManyToOne(() => User, (user: User) => user.agencyProperties, {
    onDelete: 'CASCADE',
  })
  agency: User;

  @Column({ type: 'jsonb' })
  multi_title: Record<string, string>;

  @Column({ type: 'jsonb' })
  multi_description: Record<string, string>;

  @Column({ type: 'numeric', precision: 8, scale: 2 })
  price: number;

  @Column(() => Location) //embedded
  location: Location;

  @OneToOne(() => PriorityRatio, (priorityRatio) => priorityRatio.property, {
    cascade: true,
    eager: false,
  })
  priorityRatio: PriorityRatio;

  @Column({ type: 'float', default: 0 })
  primacy: number;

  @Column({ default: false })
  isForRent: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  acceptCount: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    //make it Pending
    default: PropertyStatus.PENDING,
  })
  status: PropertyStatus;

  @Column({ type: 'varchar', nullable: true, default: null })
  propertyImage: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  firstImage: string | null;

  @Column('simple-array', { nullable: true })
  propertyImages: string[];
  /*  @Column({ type: 'jsonb', nullable: true })
    propertyImages: string[];*/

  //Record هو json مع مفاتيح
  @Column('jsonb', { nullable: true })
  panoramaImages: Record<string, string>;

  @Column({ default: 0 })
  voteScore: number;

  @Column({ default: 0 })
  @Column({ default: 0 })
  viewCount: number;

  @Column()
  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  //عملتها numeric لان ادق من float بس بتستهلك ذاكرة اكبر
  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  propertyCommissionRate: number;

  @Column({ type: 'boolean', default: false })
  commissionPaid: boolean;

  @OneToMany(() => Contract, (contracts) => contracts.property)
  contacts: Contract[];

  @OneToMany(
    () => NotificationMicro,
    (notificationMicros) => notificationMicros.property,
  )
  notificationMicros: NotificationMicro[];
}
