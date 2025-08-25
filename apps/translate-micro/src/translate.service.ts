import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TranslateService {
  constructor(private readonly configService: ConfigService) {}
  async createAndUpdatePlan(plan, PlanDto) {
    if (PlanDto.description) {
      plan.multi_description = { ar: PlanDto.description };
      plan.multi_description['en'] = await this.translate(
        'en',
        PlanDto.description,
      );
      plan.multi_description['de'] = await this.translate(
        'de',
        PlanDto.description,
      );
    }
    return plan;
  }
  getTranslatedPlan(plans, language) {
    // return plans.map(function (plan) {
    //   if (language == 'ar') {
    //     plan['description'] = plan.multi_description.ar;
    //   } else if (language == 'en') {
    //     plan['description'] = plan.multi_description.en;
    //   } else {
    //     plan['description'] = plan.multi_description.de;
    //   }
    //   return plan;
    // });
    return 'mohammed'
  }
  async createTranslatedProperty(property, createPropertyDto) {
    property.multi_description = { ar: createPropertyDto.description };
    console.log(createPropertyDto.description);
    property.multi_description['en'] = await this.translate(
      'en',
      createPropertyDto.description,
    );
    property.multi_description['de'] = await this.translate(
      'de',
      createPropertyDto.description,
    );
    property.multi_title = { ar: createPropertyDto.title };
    property.multi_title['en'] = await this.translate(
      'en',
      createPropertyDto.title,
    );
    property.multi_title['de'] = await this.translate(
      'de',
      createPropertyDto.title,
    );
    return property;
  }
  getTranslatedProperty(property, language) {
    if (language == 'ar') {
      if (property.multi_description)
        property['description'] = property.multi_description['ar'];
      property['title'] = property.multi_title['ar'];
    } else if (language == 'en') {
      if (property.multi_description)
        property['description'] = property.multi_description['en'];
      property['title'] = property.multi_title['en'];
    } else {
      if (property.multi_description)
        property['description'] = property.multi_description['de'];
      property['title'] = property.multi_title['de'];
    }
    return property;
  }
  async updateTranslatedProperty(property, updatePropertyDto) {
    if (updatePropertyDto.description) {
      property.multi_description = { ar: updatePropertyDto.description };
      property.multi_description['en'] = await this.translate(
        'en',
        updatePropertyDto.description,
      );
      property.multi_description['de'] = await this.translate(
        'de',
        updatePropertyDto.description,
      );
    }
    if (updatePropertyDto.title) {
      property.multi_title = { ar: updatePropertyDto.title };
      property.multi_title['en'] = await this.translate(
        'en',
        updatePropertyDto.title,
      );
      property.multi_title['de'] = await this.translate(
        'de',
        updatePropertyDto.title,
      );
    }
    return property;
  }
  getTranslatedReport(report, language) {
    if (language == 'ar') {
      report['description'] = report.mult_description['ar'];
    } else if (language == 'en') {
      report['description'] = report.mult_description['en'];
    } else {
      report['description'] = report.mult_description['de'];
    }
    return report;
  }
  async createTranslatedReport(report, createReportDto) {
    report.mult_description = { ar: createReportDto.description };
    report.mult_description['en'] = await this.translate(
      'en',
      createReportDto.description,
    );
    report.mult_description['de'] = await this.translate(
      'de',
      createReportDto.description,
    );
    return report;
  }
  async translate(targetLang, text) {
    const Url = this.configService.get<string>('TRANSLATE');
    const sourceLang = 'ar';
    const Url1 =
      Url +
      `?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    let translatedText;
    await fetch(Url1)
      .then((response) => response.json())
      .then((data) => {
        translatedText = data[0][0][0];
      })
      .catch((error) => {
        console.error('حدث خطأ:', error);
        console.log(Url1);
      });
    return translatedText;
  }
}
