import { Controller } from '@nestjs/common';
import { PropertiesGetProvider } from '../../properties/providers/properties-get.provider';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class FromNotificationsController {
  constructor(private readonly propertiesGetProvider: PropertiesGetProvider) {}
  @MessagePattern('properties.getOwnerAndAgency')
  async getOwnerAndAgency(@Payload() payload: { propertyId: number }) {
    console.log('getProsCount');
    return this.propertiesGetProvider.getOwnerAndAgency(payload.propertyId);
  }
}
