import { Test, TestingModule } from '@nestjs/testing';
import { BannedService } from './banned.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Banned } from './entities/banned.entity';
import { Repository } from 'typeorm';
import { UsersGetProvider } from '../users/providers/users-get.provider';
import { RpcException } from '@nestjs/microservices';
import { UnauthorizedException } from '@nestjs/common';

describe('BannedService', () => {
  let service: BannedService;
  let repo: jest.Mocked<Repository<Banned>>;
  let usersGetProvider: { findById: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BannedService,
        {
          provide: getRepositoryToken(Banned),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: UsersGetProvider,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BannedService>(BannedService);
    repo = module.get(getRepositoryToken(Banned));
    usersGetProvider = module.get(UsersGetProvider);
  });

  describe('create', () => {
    it('should create ban with correct duration (1_day)', async () => {
      usersGetProvider.findById.mockResolvedValue({ id: 1 });
      repo.save.mockResolvedValue({} as any);

      const dto = { banDuration: '1_day', reason: 'test' };
      const result = await service.create(dto as any, 1);

      expect(usersGetProvider.findById).toHaveBeenCalledWith(1);
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'test',
          user: { id: 1 },
          banExpiresAt: expect.any(Date),
        }),
      );
      expect(result).toBe('تم حظر ابن الذين');
    });

    it('should throw RpcException for unsupported unit', async () => {
      const dto = { banDuration: '10_invalid', reason: 'bad' };

      await expect(service.create(dto as any, 1)).rejects.toThrow(RpcException);
    });
  });

  describe('checkBlock', () => {
    it('should do nothing if no block', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await service.checkBlock(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
    });

    it('should delete block if expired', async () => {
      repo.findOneBy.mockResolvedValue({
        user_id: 1,
        banExpiresAt: new Date(Date.now() - 1000),
      } as any);

      await service.checkBlock(1);

      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if still banned', async () => {
      repo.findOneBy.mockResolvedValue({
        user_id: 1,
        banExpiresAt: new Date(Date.now() + 10000),
        reason: 'spam',
      } as any);

      await expect(service.checkBlock(1)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return all bans', async () => {
      repo.find.mockResolvedValue([{ id: 1 } as any]);

      const result = await service.findAll();

      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('remove', () => {
    it('should remove ban if exists', async () => {
      repo.findOne.mockResolvedValue({ user_id: 1 } as any);
      repo.remove.mockResolvedValue({} as any);

      const result = await service.remove(1);

      expect(repo.remove).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toBe('تم فك الحظر');
    });

    it('should throw RpcException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(RpcException);
    });
  });
});
