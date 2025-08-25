import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TranslateService } from './from-reports.service';

@Controller()
export class FromReportsController {
  constructor(private readonly translateService: TranslateService) {}
  @MessagePattern('translate.getTranslatedReport')
  async updateTranslatedProperty(@Payload() data: { report; language }) {
    return await this.translateService.getTranslatedReport(
      data.report,
      data.language,
    );
  }
  @MessagePattern('translate.createTranslatedReport')
  async createTranslatedReport(@Payload() data: { report; reportDto }) {
    return await this.translateService.createTranslatedReport(
      data.report,
      data.reportDto,
    );
  }
}
