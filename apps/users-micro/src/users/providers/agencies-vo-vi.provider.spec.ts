/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from '../entities/statistics.entity';
import { AgenciesVoViProvider } from './agencies-vo-vi.provider';

describe('AgenciesVoViProvider', () => {
  let agenciesVoViProvider: AgenciesVoViProvider;
  let statisticsRepository: Repository<Statistics>;
  const STATISTICS_REPOSITORY_TOKEN = getRepositoryToken(Statistics);
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        AgenciesVoViProvider,
        {
          provide: STATISTICS_REPOSITORY_TOKEN,
          useValue: {
            increment: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    agenciesVoViProvider =
      moduleRef.get<AgenciesVoViProvider>(AgenciesVoViProvider);
    statisticsRepository = moduleRef.get<Repository<Statistics>>(
      STATISTICS_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(agenciesVoViProvider).toBeDefined();
  });
  it('changeVotesNum test', async () => {
    const ownerId = 1;
    const value = 2;
    const find = { user_id: ownerId };
    const column = 'agencyVotes';
    expect(
      agenciesVoViProvider.changeVotesNum(ownerId, value),
    ).resolves.toEqual(undefined);
    expect(statisticsRepository.increment).toHaveBeenCalledWith(
      find,
      column,
      value,
    );
  });
  it('chanePropertiesNum test', async () => {
    const ownerId = 1;
    const value = 2;
    const find = { user_id: ownerId };
    const column = 'propertyCount';
    expect(
      agenciesVoViProvider.chanePropertiesNum(ownerId, value),
    ).resolves.toEqual(undefined);
    expect(statisticsRepository.increment).toHaveBeenCalledWith(
      find,
      column,
      value,
    );
  });
  it('incrementTotalViews test', async () => {
    const ownerId = 1;
    const find = { user_id: ownerId };
    const column = 'agencyViews';
    expect(agenciesVoViProvider.incrementTotalViews(ownerId)).resolves.toEqual(
      undefined,
    );
    expect(statisticsRepository.increment).toHaveBeenCalledWith(
      find,
      column,
      1,
    );
  });
});
