/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PriorityRatio } from '../entities/priority-ratio.entity';
import { Property } from '../entities/property.entity';
import { PropertiesVoSuViProvider } from './properties-vo-su-vi.provider';
describe('PropertiesVoSuViProvider', () => {
  let propertiesVoSuViProvider: PropertiesVoSuViProvider;
  let propertyRepository: Repository<Property>;
  let priorityRatioRepository: Repository<PriorityRatio>;
  const PROPERTY_REPOSITORY_TOKEN = getRepositoryToken(Property);
  const PRIORITYRATIO_REPOSITORY_TOKEN = getRepositoryToken(PriorityRatio);
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        PropertiesVoSuViProvider,
        {
          provide: PROPERTY_REPOSITORY_TOKEN,
          useValue: {
            increment: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PRIORITYRATIO_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
      ], // Add
    }).compile();
    propertiesVoSuViProvider = moduleRef.get<PropertiesVoSuViProvider>(
      PropertiesVoSuViProvider,
    );
    propertyRepository = moduleRef.get<Repository<Property>>(
      PROPERTY_REPOSITORY_TOKEN,
    );
    priorityRatioRepository = moduleRef.get<Repository<PriorityRatio>>(
      PRIORITYRATIO_REPOSITORY_TOKEN,
    );
  });
  it('should be defined', () => {
    expect(propertiesVoSuViProvider).toBeDefined();
  });
  it('changeVotesNum test', async () => {
    const propertyId = 1;
    const value = 2;
    const find = { id: propertyId };
    const column = 'voteScore';
    await expect(
      propertiesVoSuViProvider.changeVotesNum(propertyId, value),
    ).resolves.toEqual(undefined);
    expect(propertyRepository.increment).toHaveBeenCalledWith(
      find,
      column,
      value,
    );
  });
  it('changeViewsNum test', async () => {
    const propertyId = 2;
    const value = 1;
    const find = { id: propertyId };
    const column = 'viewCount';
    await expect(
      propertiesVoSuViProvider.changeViewsNum(propertyId),
    ).resolves.toEqual(undefined);
    expect(propertyRepository.increment).toHaveBeenCalledWith(
      find,
      column,
      value,
    );
  });
  it('computeSuitabilityRatio test', async () => {
    const property = {
      rooms: 1,
      bathrooms: 2,
      area: 3,
      hasGarage: false,
      hasGarden: true,
      price: 4,
      priorityRatio: { suitabilityRatio: 0 },
      primacy: 0,
    } as Property;
    const manage = propertyRepository;
    const findMin = {
      order: { price: 'ASC' },
      select: { price: true },
      take: 1,
    };
    const findMax = {
      order: { price: 'DESC' },
      select: { price: true },
      take: 1,
    };
    const min = [{ price: 5 }];
    const max = [{ price: 6 }];
    let score = 0;
    score += 20 * Math.min(property.rooms / 3, 1);
    score += 15 * Math.min(property.bathrooms / 2, 1);
    score += 25 * Math.min(property.area / 120, 1);
    score += 10 * (property.hasGarden ? 1 : 0);
    score += 10 * (property.hasGarage ? 1 : 0);
    let priceScore = 1 - (property.price - min[0].price) / 1;
    console.log(priceScore);
    priceScore = Math.max(0, Math.min(1, priceScore));
    score += 20 * priceScore;
    const suitabilityRatio = score / 2;
    const primacy = suitabilityRatio;
    const save = {
      ...property,
      ...{
        priorityRatio: { suitabilityRatio: suitabilityRatio },
        primacy: primacy,
      },
    } as Property;
    jest
      .spyOn(propertyRepository, 'find')
      .mockResolvedValueOnce(min as any)
      .mockResolvedValueOnce(max as any);
    jest
      .spyOn(priorityRatioRepository, 'create')
      .mockReturnValueOnce({} as never);
    jest.spyOn(propertyRepository, 'save').mockResolvedValueOnce(save);
    await expect(
      propertiesVoSuViProvider.computeSuitabilityRatio(property),
    ).resolves.toEqual(save);
    expect(propertyRepository.find).toHaveBeenNthCalledWith(1, findMin);
    expect(propertyRepository.find).toHaveBeenNthCalledWith(2, findMax);
    expect(priorityRatioRepository.create).toHaveBeenCalled();
    expect(propertyRepository.save).toHaveBeenCalledWith(save);
  });
});
