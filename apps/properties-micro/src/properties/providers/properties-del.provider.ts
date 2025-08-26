import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../entities/property.entity';
import { Repository } from 'typeorm';
import { PropertiesGetProvider } from './properties-get.provider';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PropertiesDelProvider {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    private readonly propertiesGetProvider: PropertiesGetProvider,
    @Inject('ANALYTICS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {}

  async deleteOwnerPro(proId: number, ownerId: number, password: string) {
    const property = await this.propertyRepository.findOne({
      //if it is mine && get password
      where: { id: proId, owner: { id: ownerId } },
      relations: { owner: true },
      select: { owner: { password: true } },
    });
    if (!property) {
      throw new NotFoundException('Removed by Admin Or it is not yours');
    }
    const isPass = await bcrypt.compare(password, property.owner.password);
    if (!isPass) {
      throw new UnauthorizedException('Password is incorrect');
    }
    this.usersClient.emit('analytics.chanePropertiesNum', {
      userId: ownerId,
      value: -1,
    });
    return this.propertyRepository.delete({ id: proId });
  }

  async deleteProById(id: number) {
    const property = this.propertiesGetProvider.findById(id);
    return this.propertyRepository.delete({ id: id });
  }
}
