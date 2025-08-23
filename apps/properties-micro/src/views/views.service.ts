import { Inject, Injectable } from '@nestjs/common';

import { View } from './entities/view.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertiesGetProvider } from '../properties/providers/properties-get.provider';
import { PropertiesVoSuViProvider } from '../properties/providers/properties-vo-su-vi.provider';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    private readonly propertiesGetProvider: PropertiesGetProvider,
    private readonly propertiesVoViProvider: PropertiesVoSuViProvider,
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {}

  async create(proId: number, agencyId: number) {
    const view = await this.viewRepository.findOne({
      where: { property: { id: proId }, user: { id: agencyId } },
    });
    if (!view) {
      //تحقق من وجود العقار و جيب صاحبه
      const property = await this.propertiesGetProvider.getUserIdByProId(proId);
      const agencyId = property.agency.id;
      // if (ownerId === userId) return; make it
      await this.viewRepository.save({
        property: { id: proId },
        user: { id: agencyId },
      });
      this.usersClient.emit('stats.incrementTotalViews', { agencyId });
      return await this.propertiesVoViProvider.changeViewsNum(proId);
    }
  }
}
