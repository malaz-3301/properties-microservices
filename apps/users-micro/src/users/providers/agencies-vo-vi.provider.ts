import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Statistics } from '../entities/statistics.entity';
import { AgencyInfo } from '../entities/agency-info.entity';

//increment depends on value
@Injectable()
export class AgenciesVoViProvider {
  constructor(
    @InjectRepository(AgencyInfo)
    private readonly agencyInfoRepository: Repository<AgencyInfo>,
  ) {}

  async changeVotesNum(ownerId: number, value: number) {
    await this.agencyInfoRepository.increment(
      { user_id: ownerId },
      'agencyVotes',
      value,
    );
  }

  //PropertyCount
  async chanePropertiesNum(
    ownerId: number,
    value: number,
    manager?: EntityManager,
  ) {
    const repository = manager
      ? manager.getRepository(Statistics)
      : this.agencyInfoRepository;

    await repository.increment({ user_id: ownerId }, 'propertyCount', value);
  }

  async incrementTotalViews(ownerId: number) {
    await this.agencyInfoRepository.increment(
      { user_id: ownerId },
      'agencyViews',
      1,
    );
  }
}
