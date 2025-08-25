import { Test, TestingModule } from '@nestjs/testing';
import { ViewsService } from './views.service';
import { PropertiesGetProvider } from '../properties/providers/properties-get.provider';
import { PropertiesVoSuViProvider } from '../properties/providers/properties-vo-su-vi.provider';
import { Repository, View } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ViewsService', () => {
  let service: ViewsService;
  let viewRepository: Repository<View>;
  let propertiesGetProvider: PropertiesGetProvider;
  let propertiesVoSuViProvider: PropertiesVoSuViProvider;
  let usersClient = { emit: jest.fn() };
  const VIEW_REPOSITORY_TOKEN = getRepositoryToken(View);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewsService,
        {
          provide: VIEW_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PropertiesGetProvider,
          useValue: {
            getUserIdByProId: jest.fn(),
          },
        },
        {
          provide: PropertiesVoSuViProvider,
          useValue: {
            changeViewsNum: jest.fn(),
          },
        },
        {
          provide: 'USERS_SERVICE',
          useValue: usersClient,
        },
      ],
    }).compile();

    service = module.get<ViewsService>(ViewsService);
    viewRepository = module.get<Repository<View>>(VIEW_REPOSITORY_TOKEN);
    propertiesGetProvider = module.get<PropertiesGetProvider>(
      PropertiesGetProvider,
    );
    propertiesVoSuViProvider = module.get<PropertiesVoSuViProvider>(
      PropertiesVoSuViProvider,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create test', async () => {
    const propertyId = 1;

    const agencyId = 1;

    const findView = {
      where: { property: { id: propertyId }, user: { id: agencyId } },
    };

    const propertyAgency = { agency: { id: 2 } } as any;

    const saveView = {
      property: { id: propertyId },
      user: { id: propertyAgency.agency.id },
    };

    jest.spyOn(viewRepository, 'findOne').mockResolvedValueOnce(null);

    jest
      .spyOn(propertiesGetProvider, 'getUserIdByProId')
      .mockResolvedValueOnce(propertyAgency);

    await expect(service.create(propertyId, agencyId)).resolves.toEqual(
      undefined,
    );

    expect(viewRepository.findOne).toHaveBeenCalledWith(findView);

    expect(propertiesGetProvider.getUserIdByProId).toHaveBeenCalledWith(
      propertyId,
    );

    expect(viewRepository.save).toHaveBeenCalledWith(saveView);

    expect(usersClient.emit).toHaveBeenCalledWith('stats.incrementTotalViews', {
      agencyId: propertyAgency.agency.id,
    });

    expect(propertiesVoSuViProvider.changeViewsNum).toHaveBeenCalledWith(
      propertyId,
    );
  });
});
