import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TranslateService } from './translate.service';
@Controller()
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}
}

//   @MessagePattern('translate.createAndUpdatePlan')
//   async createAndUpdatePlan(@Payload() payload: { plan; planDto }) {
//     return this.translateService.createAndUpdatePlan(
//       payload.plan,
//       payload.planDto,
//     );
//   }
//   @MessagePattern('translate.createTranslatedProperty')
//   async createTranslatedProperty(
//     @Payload() payload: { property; propertyDto },
//   ) {
//     return this.translateService.createTranslatedProperty(
//       payload.property,
//       payload.propertyDto,
//     );
//   }
//   @MessagePattern('translate.createTranslatedReport')
//   async createTranslatedReport(@Payload() payload: { report; reportDto }) {
//     return this.translateService.createTranslatedReport(
//       payload.report,
//       payload.reportDto,
//     );
//   }
//   @MessagePattern('translate.getTranslatedPlan')
//   async getTranslatedPlan(@Payload() payload: { plan; language }) {
//     return this.translateService.getTranslatedPlan(
//       payload.plan,
//       payload.language,
//     );
//   }
//   @MessagePattern('translate.getTranslatedProperty')
//   async getTranslatedProperty(@Payload() payload: { property; language }) {
//     return this.translateService.getTranslatedProperty(
//       payload.property,
//       payload.language,
//     );
//   }
//   @MessagePattern('translate.getTranslatedReport')
//   async getTranslatedReport(@Payload() payload: { report; language }) {
//     return this.translateService.getTranslatedReport(
//       payload.report,
//       payload.language,
//     );
//   }
//   @MessagePattern('translate.translate')
//   async translate(@Payload() payload: { language; text }) {
//     return this.translateService.translate(payload.language, payload.text);
//   }
//   @MessagePattern('translate.updateTranslatedProperty')
//   async updateTranslatedProperty(
//     @Payload() payload: { property; propertyDto },
//   ) {
//     return this.translateService.updateTranslatedProperty(
//       payload.property,
//       payload.propertyDto,
//     );
//   }
// }
