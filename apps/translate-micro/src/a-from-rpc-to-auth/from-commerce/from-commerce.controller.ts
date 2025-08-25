import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TranslateService } from './from-commerce.service';

@Controller()
export class FromCommerceController {
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
}
