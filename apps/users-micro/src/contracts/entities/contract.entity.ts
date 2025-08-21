
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '@malaz/contracts/utils/constants';
import { Property } from '../../../../properties-micro/src/properties/entities/property.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;
  

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  expireIn: Date;

  @ManyToOne(() => Property, (property) => property.contacts)
  property: Property;

  @ManyToOne(() => User, (user) => user.contracts)
  user: User;


  @Column({type : 'float'})
  price: number;

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @ManyToOne(() => User, (user: User) => user.agencyProperties)
  agency: User;
}
