import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PropertiesGetProvider } from '../../properties/providers/properties-get.provider';

@Controller()
export class DuplicateController {
  constructor(private readonly propertiesGetProvider: PropertiesGetProvider) {}

  @MessagePattern('properties.findById')
  async findById(@Payload() payload: { proId: number }) {
    const { proId } = payload;
    return await this.propertiesGetProvider.findById(proId);
  }
}
