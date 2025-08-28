import { Test, TestingModule } from '@nestjs/testing';
import { CronService } from './cron.service';
import { DataSource } from 'typeorm';
import { OrderStatus, PropertyStatus } from '@malaz/contracts/utils/enums';

describe('CronService', () => {
  let service: CronService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronService,
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CronService>(CronService);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('checkExpiredPlans', () => {
    it('should return "No expired subscriptions found this day." if no rows updated', async () => {
      (dataSource.query as jest.Mock).mockResolvedValueOnce([]);
      const result = await service.checkExpiredPlans();
      expect(result).toBe('No expired subscriptions found this day.');
      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('WITH expired_orders'),
        [
          OrderStatus.EXPIRED,
          OrderStatus.ACTIVE,
          expect.any(Date),
          1,
          PropertyStatus.HIDDEN,
        ],
      );
    });

    it('should return number of updated rows if action not empty', async () => {
      (dataSource.query as jest.Mock).mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      const result = await service.checkExpiredPlans();
      expect(result).toBe(2);
    });
  });

  describe('deleteViewEntity', () => {
    it('should truncate views table', async () => {
      (dataSource.query as jest.Mock).mockResolvedValueOnce(undefined);
      await service.deleteViewEntity();
      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('TRUNCATE TABLE "views"'),
      );
    });
  });

  describe('divisionVotes', () => {
    it('should update property primacy with division logic', async () => {
      (dataSource.query as jest.Mock).mockResolvedValueOnce(undefined);
      await service.divisionVotes();
      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE property p'),
        [30],
      );
    });
  });

  describe('divisionVotes1', () => {
    it('should reset primacy and voteRatio', async () => {
      (dataSource.query as jest.Mock)
        .mockResolvedValueOnce(undefined) // أول update
        .mockResolvedValueOnce(undefined); // ثاني update

      await service.divisionVotes1();

      expect(dataSource.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('UPDATE property p'),
      );
      expect(dataSource.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('UPDATE "priority ratio"'),
      );
    });
  });
});
