import { Test, TestingModule } from '@nestjs/testing';
import { ReportsMicroService } from './reports-micro.service';
import { Repository } from 'typeorm';
import { ReportsMicro } from './entities/reports-micro.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UserType } from '@malaz/contracts/utils/enums';

describe('ReportsMicroService', () => {
  let service: ReportsMicroService;
  let repo: Repository<ReportsMicro>;
  let usersClient: ClientProxy;
  let translateClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsMicroService,
        {
          provide: getRepositoryToken(ReportsMicro),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            create: jest.fn((dto) => dto),
          },
        },
        {
          provide: 'USERS_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: 'TRANSLATE_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsMicroService>(ReportsMicroService);
    repo = module.get<Repository<ReportsMicro>>(
      getRepositoryToken(ReportsMicro),
    );
    usersClient = module.get<ClientProxy>('USERS_SERVICE');
    translateClient = module.get<ClientProxy>('TRANSLATE_SERVICE');

    // Mock usersClient.send to return observable
    usersClient.send = jest.fn().mockImplementation((pattern, data) => {
      return of({ id: 1, userType: 'SUPER_ADMIN', language: 'ar' });
    });

    // Mock translateClient.send to return observable
    translateClient.send = jest.fn().mockImplementation((pattern, data) => {
      return of(data.report);
    });

    // Mock repo methods
    repo.find = jest.fn();
    repo.findOneBy = jest.fn();
    repo.save = jest.fn();
    repo.update = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('report should create and save a report', async () => {
    const dto = {
      reason: 'Test',
      otherReason: '',
      description: 'desc',
      title: 'title',
    };
    repo.save = jest.fn().mockResolvedValue(dto);
    const result = await service.report(dto as any);
    expect(result).toEqual(dto);
  });

  it('getAll should return reports for SUPER_ADMIN', async () => {
    const reports = [
      { id: 1, userType: UserType.ADMIN, mult_description: { ar: 'desc' } },
    ];
    repo.find = jest.fn().mockResolvedValue(reports);
    const result = await service.getAll(1);
    expect(result).toEqual(reports);
  });

  it('getOne should return single report', async () => {
    const report = { id: 1, mult_description: { ar: 'desc' } };
    repo.findOneBy = jest.fn().mockResolvedValue(report);
    const result = await service.getOne(1, 1);
    expect(result).toEqual(report);
  });

  it('update should set reportStatus to FIXED or Rejected', async () => {
    const report = { id: 1 };
    repo.findOneBy = jest.fn().mockResolvedValue(report);
    repo.update = jest.fn().mockResolvedValue({ affected: 1 });
    const fixed = await service.update(1, true);
    const rejected = await service.update(1, false);
    expect(fixed).toEqual({ affected: 1 });
    expect(rejected).toEqual({ affected: 1 });
  });
});
