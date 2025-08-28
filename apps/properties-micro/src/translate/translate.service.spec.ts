// translate.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TranslateService } from './translate.service';

// نعمل mock للـ fetch
global.fetch = jest.fn();

describe('TranslateService', () => {
  let service: TranslateService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslateService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://fake-translate-api'),
          },
        },
      ],
    }).compile();

    service = module.get<TranslateService>(TranslateService);
    configService = module.get<ConfigService>(ConfigService);

    // إعادة تعيين mocks
    (fetch as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('translate', () => {
    it('should call fetch and return translated text', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => [[['Hello World']]],
      });

      const result = await service.translate('en', 'مرحبا بالعالم');
      expect(result).toBe('Hello World');
      expect(configService.get).toHaveBeenCalledWith('TRANSLATE');
      expect(fetch).toHaveBeenCalled();
    });

    it('should handle fetch error gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('network error'));

      const result = await service.translate('en', 'مرحبا');
      expect(result).toBeUndefined();
    });
  });

  describe('createAndUpdatePlan', () => {
    it('should add translations to plan', async () => {
      jest
        .spyOn(service, 'translate')
        .mockResolvedValueOnce('English Desc')
        .mockResolvedValueOnce('German Desc');

      const plan = {};
      const PlanDto = { description: 'وصف' };

      const result = await service.createAndUpdatePlan(plan, PlanDto);

      expect(result.multi_description.ar).toBe('وصف');
      expect(result.multi_description.en).toBe('English Desc');
      expect(result.multi_description.de).toBe('German Desc');
    });
  });

  describe('getTranslatedPlans', () => {
    it('should return plans with correct language', () => {
      const plans = [
        {
          multi_description: { ar: 'عربي', en: 'English', de: 'Deutsch' },
        },
      ];

      const result = service.getTranslatedPlans(plans, 'en');
      expect(result[0].description).toBe('English');
    });
  });

  describe('createTranslatedProperty', () => {
    it('should add multi title and description', async () => {
      jest
        .spyOn(service, 'translate')
        .mockResolvedValueOnce('English Desc')
        .mockResolvedValueOnce('German Desc')
        .mockResolvedValueOnce('English Title')
        .mockResolvedValueOnce('German Title');

      const property = {};
      const dto = { description: 'وصف', title: 'عنوان' };

      const result = await service.createTranslatedProperty(property, dto);

      expect(result.multi_description.ar).toBe('وصف');
      expect(result.multi_title.ar).toBe('عنوان');
      expect(result.multi_title.en).toBe('English Title');
    });
  });

  describe('getTranslatedProperty', () => {
    it('should return correct language values', () => {
      const property = {
        multi_description: { ar: 'عربي', en: 'English', de: 'Deutsch' },
        multi_title: { ar: 'عنوان', en: 'Title', de: 'Titel' },
      };

      const result = service.getTranslatedProperty(property, 'de');
      expect(result.description).toBe('Deutsch');
      expect(result.title).toBe('Titel');
    });
  });

  describe('updateTranslatedProperty', () => {
    it('should update translations when dto provided', async () => {
      jest
        .spyOn(service, 'translate')
        .mockResolvedValueOnce('English Desc')
        .mockResolvedValueOnce('German Desc')
        .mockResolvedValueOnce('English Title')
        .mockResolvedValueOnce('German Title');

      const property = {};
      const dto = { description: 'وصف جديد', title: 'عنوان جديد' };

      const result = await service.updateTranslatedProperty(property, dto);

      expect(result.multi_description.en).toBe('English Desc');
      expect(result.multi_title.de).toBe('German Title');
    });
  });

  describe('createTranslatedReport', () => {
    it('should create report with translations', async () => {
      jest
        .spyOn(service, 'translate')
        .mockResolvedValueOnce('English Report')
        .mockResolvedValueOnce('German Report');

      const report = {};
      const dto = { description: 'تقرير' };

      const result = await service.createTranslatedReport(report, dto);

      expect(result.mult_description.ar).toBe('تقرير');
      expect(result.mult_description.en).toBe('English Report');
    });
  });

  describe('getTranslatedReport', () => {
    it('should return report with correct language', () => {
      const report = {
        mult_description: { ar: 'تقرير', en: 'Report', de: 'Bericht' },
      };

      const result = service.getTranslatedReport(report, 'en');
      expect(result.description).toBe('Report');
    });
  });
});

