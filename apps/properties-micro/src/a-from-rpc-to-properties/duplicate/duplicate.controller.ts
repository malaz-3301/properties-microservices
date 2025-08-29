import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PropertiesGetProvider } from '../../properties/providers/properties-get.provider';
import { UserType } from '@malaz/contracts/utils/enums';

@Controller()
export class DuplicateController {
  constructor(private readonly propertiesGetProvider: PropertiesGetProvider) {}

  @MessagePattern('properties.findById')
  async findById(@Payload() payload: { proId: number }) {
    const { proId } = payload;
    return await this.propertiesGetProvider.findById(proId);
  }

  @MessagePattern('properties.getUserPro')
  async getUserPro(
    @Payload() payload: { proId: number; userId: number; role: UserType },
  ) {
    return await this.propertiesGetProvider.getProByUser(
      payload.proId,
      payload.userId,
      payload.role,
    );
  }

  @MessagePattern('properties.getAgencyAndPros')
  async getAgencyPros(@Payload() payload: { agencyId: number }) {
    return await this.propertiesGetProvider.getProsByAgency(payload.agencyId);
  }
}
