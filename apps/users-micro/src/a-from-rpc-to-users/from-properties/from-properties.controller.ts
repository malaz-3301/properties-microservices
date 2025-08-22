import { Controller } from '@nestjs/common';
import { FromPropertiesService } from './from-properties.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from '../../users/users.service';
import { AgenciesVoViProvider } from '../../users/providers/agencies-vo-vi.provider';

@Controller()
export class FromPropertiesController {
  constructor(
    private readonly fromPropertiesService: FromPropertiesService,
    private readonly usersService: UsersService,
    private readonly agenciesVoViProvider: AgenciesVoViProvider,
  ) {}

  @MessagePattern('agencies.getOneAgencyInfo')
  async getOneAgencyInfo(@Payload() payload: { agencyId: number }) {
    const { agencyId } = payload;
    return await this.usersService.getOneAgencyInfo(agencyId);
  }

  @EventPattern('analytics.chanePropertiesNum')
  async chanePropertiesNum(
    @Payload() payload: { ownerId: number; value: number },
  ) {
    const { ownerId, value } = payload;
    return await this.agenciesVoViProvider.chanePropertiesNum(ownerId, value);
  }
}
