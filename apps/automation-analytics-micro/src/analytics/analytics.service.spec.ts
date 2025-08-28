import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { DataSource } from 'typeorm';
import {
  OrderStatus,
  ReportStatus,
  ReportTitle,
  UserType,
} from '@malaz/contracts/utils/enums';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('create', () => {
    it('should return create message', () => {
      const dto = { test: 'value' } as any;
      expect(service.create(dto)).toBe('This action adds a new analytics');
    });
  });

  describe('findOne', () => {
    it('should return findOne message', () => {
      expect(service.findOne(5)).toBe('This action returns a #5 analytics');
    });
  });

  describe('findAll', () => {
    it('should return total counts and monthly stats', async () => {
      const mockResult1 = [{ Users: 10, Agencies: 5 }];
      const mockResult2 = [{ Month: 'January', Users: 2, Agencies: 1 }];

      (dataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockResult1) // أول استعلام (count)
        .mockResolvedValueOnce(mockResult2); // ثاني استعلام (monthly)

      const result = await service.findAll();

      expect(result).toEqual({
        TotalCounts: mockResult1[0], // ✅ object واحد من أول استعلام
        MonthlyStats: mockResult2,   // ✅ المصفوفة كاملة من ثاني استعلام
      });

      expect(dataSource.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('FROM users u;'),
        [
          UserType.Owner,
          UserType.AGENCY,
          OrderStatus.ACTIVE,
          ReportTitle.T3,
          ReportStatus.FIXED,
        ],
      );

      expect(dataSource.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('FROM unnest'),
        [
          UserType.Owner,
          UserType.AGENCY,
          OrderStatus.ACTIVE,
          ReportTitle.T3,
          ReportStatus.FIXED,
        ],
      );
    });
  });
});
