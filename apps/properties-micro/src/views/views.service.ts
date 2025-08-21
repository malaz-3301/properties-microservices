import { Injectable } from '@nestjs/common';

import { View } from './entities/view.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertiesGetProvider } from '../properties/providers/properties-get.provider';
import { PropertiesVoSuViProvider } from '../properties/providers/properties-vo-su-vi.provider';
import { AgenciesVoViProvider } from '../../../users-micro/src/users/providers/agencies-vo-vi.provider';
import { User } from '../../../users-micro/src/users/entities/user.entity';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly propertiesGetProvider: PropertiesGetProvider,
    private readonly propertiesVoViProvider: PropertiesVoSuViProvider,
    private readonly agenciesVoViProvider: AgenciesVoViProvider,
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
      await this.agenciesVoViProvider.incrementTotalViews(agencyId);
      return await this.propertiesVoViProvider.changeViewsNum(proId);
    }
  }
}
