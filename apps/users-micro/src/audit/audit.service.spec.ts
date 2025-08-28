import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { Repository } from 'typeorm';
import { UsersGetProvider } from '../users/providers/users-get.provider';

describe('AuditService', () => {
  let service: AuditService;
  let repo: jest.Mocked<Repository<Audit>>;
  let usersGetProvider: { getAdminById: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(Audit),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: UsersGetProvider,
          useValue: { getAdminById: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    repo = module.get(getRepositoryToken(Audit));
    usersGetProvider = module.get(UsersGetProvider);
  });

  describe('create', () => {
    it('should create an audit log with admin info', async () => {
      usersGetProvider.getAdminById.mockResolvedValue({
        id: 1,
        username: 'adminUser',
      });
      repo.save.mockResolvedValue({ id: 1 } as any);

      const meta = { action: 'create_user' };
      const result = await service.create(1, meta);

      expect(usersGetProvider.getAdminById).toHaveBeenCalledWith(1);
      expect(repo.save).toHaveBeenCalledWith({
        admin: { id: 1 },
        meta: {
          action: 'create_user',
          admin: { adminId: 1, username: 'adminUser' },
        },
      });
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return logs with formatted createdAt', async () => {
      const date = new Date('2025-08-28T14:35:00Z');
      repo.find.mockResolvedValue([
        { meta: { action: 'test' }, createdAt: date },
      ] as any);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalledWith({
        select: { meta: true, createdAt: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([
        {
          meta: { action: 'test' },
          createdAt: `${date.getFullYear()}/${String(
            date.getMonth() + 1,
          ).padStart(2, '0')}/${String(date.getDate()).padStart(
            2,
            '0',
          )}  ${date.getHours()}:${date.getMinutes()}`,
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return one audit by id', async () => {
      repo.findOneBy.mockResolvedValue({ id: 1, meta: {} } as any);

      const result = await service.findOne(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ id: 1, meta: {} });
    });
  });

  describe('update', () => {
    it('should return update message', () => {
      const result = service.update(1, { meta: {} } as any);
      expect(result).toBe('This action updates a #1 audit');
    });
  });

  describe('remove', () => {
    it('should return remove message', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 audit');
    });
  });
});
