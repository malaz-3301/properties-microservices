import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PropertiesGetProvider } from '../../properties/providers/properties-get.provider';
import { PropertiesUpdateProvider } from '../../properties/providers/properties-update.provider';

@Controller()
export class FromCommerceController {
  constructor(
    private readonly propertiesGetProvider: PropertiesGetProvider,
    private readonly propertiesUpdateProvider: PropertiesUpdateProvider,
  ) {}

  @MessagePattern('properties.getProsCount')
  async handleGetProsCount(@Payload() payload: { userId: number }) {
    const { userId } = payload;
    console.log('getProsCount')
    return this.propertiesGetProvider.getProsCount(userId);
  }

  @MessagePattern('properties.markCommissionPaid')
  async handleMarkCommissionPaid(@Payload() payload: { proId: number }) {
    const { proId } = payload;
    return await this.propertiesUpdateProvider.markCommissionPaid(proId);
  }
}
