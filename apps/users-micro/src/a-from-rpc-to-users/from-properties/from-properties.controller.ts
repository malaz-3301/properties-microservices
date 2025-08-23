import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from '../../users/users.service';
import { AgenciesVoViProvider } from '../../users/providers/agencies-vo-vi.provider';

@Controller()
export class FromPropertiesController {
  constructor(
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
    @Payload() payload: { userId: number; value: number },
  ) {
    const { userId, value } = payload;
    return await this.agenciesVoViProvider.chanePropertiesNum(userId, value);
  }

  @EventPattern('stats.incrementTotalViews')
  async incrementTotalViews(@Payload() data: { agencyId: number }) {
    const { agencyId } = data;
    return await this.agenciesVoViProvider.incrementTotalViews(agencyId);
  }

  @EventPattern('stats.changeVotesNum')
  async changeVotesNum(@Payload() payload: { id: number; value: number }) {
    const { id, value } = payload;
    await this.agenciesVoViProvider.changeVotesNum(id, value); //agency
  }
}
