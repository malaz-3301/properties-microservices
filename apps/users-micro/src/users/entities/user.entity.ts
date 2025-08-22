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
import { Exclude } from 'class-transformer';

import { OtpEntity } from './otp.entity';

import { Statistics } from './statistics.entity';
import { AgencyInfo } from './agency-info.entity';
import { Banned } from '../../banned/entities/banned.entity';
import { CURRENT_TIMESTAMP } from '@malaz/contracts/utils/constants';
import { Vote } from '../../../../properties-micro/src/votes/entities/vote.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { Property } from 'apps/properties-micro/src/properties/entities/property.entity';
import { Language, UserType } from '@malaz/contracts/utils/enums';
import { Audit } from '../../audit/entities/audit.entity';
import { View } from 'apps/properties-micro/src/views/entities/view.entity';
import { Favorite } from '../../../../properties-micro/src/favorite/entities/favorite.entity';
import { NotificationMicro } from '../../../../notifications-micro/src/entities/notification-micro.entity';
import { Location } from '../../geolocation/entities/location.embedded';
import { Plan } from '../../../../commerce-micro/src/plans/entities/plan.entity';
import { Order } from '../../../../commerce-micro/src/orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 11, unique: true })
  phone: string;
  //make it unique
  @Column({ type: 'varchar', length: 18, unique: true })
  username: string;

  @Column({ type: 'varchar' })
  @Exclude() //SerializerInterceptor
  password: string;

  @Column(() => Location) //embedded
  location: Location;

  @Column({ type: 'integer', default: 18 })
  age: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.Owner })
  userType: UserType;

  @Column({ type: 'boolean', default: false })
  isAccountVerified: boolean;

  @OneToOne(() => OtpEntity, (otpEntity) => otpEntity.user, {
    cascade: true,
  })
  otpEntity: OtpEntity;

  @OneToOne(() => AgencyInfo, (agencyInfo) => agencyInfo.user, {
    cascade: true,
  })
  agencyInfo: AgencyInfo;

  @OneToOne(() => Statistics, (statistics) => statistics.user, {
    cascade: true,
  })
  statistics?: Statistics;

  @OneToOne(() => Banned, (banned) => banned.user, {
    cascade: true,
  })
  banned?: Banned;

  @OneToMany(() => Property, (property: Property) => property.owner)
  ownerProperties?: Property[];

  @OneToMany(() => Property, (property: Property) => property.agency)
  agencyProperties?: Property[];

  @OneToMany(() => Contract, (contract: Contract) => contract.agency)
  agencyContracts?: Contract[];

  @OneToMany(() => Vote, (vote: Vote) => vote.user)
  votes?: Vote[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  profileImage: string | null;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Contract, (contracts) => contracts.user)
  contracts: Contract[];
  ////
  @ManyToOne(() => Plan, (plan: Plan) => plan.users)
  plan?: Plan;

  /*ازلها  @Column({ type: 'int', nullable: true })
    planId: number;*/

  @Column({ default: false })
  hasUsedTrial: boolean;
  ////
  @OneToMany(() => Order, (order: Order) => order.user)
  orders?: Order[];

  @OneToMany(
    () => NotificationMicro,
    (notificationMicros) => notificationMicros.user,
  )
  notificationMicros: NotificationMicro[];

  @OneToMany(() => Audit, (audit) => audit.admin)
  audits: Audit[];

  @OneToMany(() => View, (view) => view.user, { cascade: true })
  views?: View[];

  @Column()
  token: string;

  @Column({ type: 'enum', enum: Language, default: Language.ARABIC })
  language: Language;
  /*  @Column({ nullable: true })
    stripeAccountId: string;

    @Column({ nullable: true })
    onboardingUrl: string;*/
}
