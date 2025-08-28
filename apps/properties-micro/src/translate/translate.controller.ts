import { Controller, Inject, Logger } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { PropertiesUpdateProvider } from '../properties/providers/properties-update.provider';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RmqRecordBuilder,
} from '@nestjs/microservices';

@Controller()
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @MessagePattern('translate.createAndUpdatePlan')
  async createAndUpdatePlan(@Payload() payload: { plan; planDto }) {
    return this.translateService.createAndUpdatePlan(
      payload.plan,
      payload.planDto,
    );
  }

  @MessagePattern('translate.getTranslatedPlans')
  async getTranslatedPlans(@Payload() { plan, language }) {
    console.log('plan');
    return await this.translateService.getTranslatedPlans(plan, language);
  }

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
  @MessagePattern('translate.createTranslatedReport')
  async createTranslatedReport(@Payload() data: { report; reportDto }) {
    return await this.translateService.createTranslatedReport(
      data.report,
      data.reportDto,
    );
  }
  @MessagePattern('translate.translate')
  async translate(@Payload() data: { language; message }) {
    return await this.translateService.translate(
      data.language,
      data.message,
    );
  }
}
