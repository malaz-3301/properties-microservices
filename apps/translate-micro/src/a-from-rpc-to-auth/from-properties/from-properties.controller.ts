import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TranslateService } from './from-properties.service';

@Controller()
export class FromPropertiesController {
  constructor(private readonly translateService: TranslateService) {}

  @MessagePattern('translate.getTranslatedProperty')
  async getTranslatedProperty(@Payload() payload: { property; language }) {
    return await this.translateService.getTranslatedProperty(
      payload.property,
      payload.language,
    );
  }
  @MessagePattern('translate.getTranslatedProperties')
  async getTranslatedProperties(@Payload() payload: { property; language }) {
    return await this.translateService.getTranslatedProperties(
      payload.property,
      payload.language,
    );
  }
  @MessagePattern('translate.createTranslatedProperty')
  async createTranslatedProperty(
    @Payload() payload: { property; propertyDto },
  ) {
    return await this.translateService.createTranslatedProperty(
      payload.property,
      payload.propertyDto,
    );
  }

  @MessagePattern('translate.updateTranslatedPropert')
  async updateTranslatedProperty(@Payload() data: { property; propertyDto }) {
    return await this.translateService.updateTranslatedProperty(
      data.property,
      data.propertyDto,
    );
  }
}
