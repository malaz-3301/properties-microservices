import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes.service';
import { PropertiesGetProvider } from '../properties/providers/properties-get.provider';
import { PropertiesVoSuViProvider } from '../properties/providers/properties-vo-su-vi.provider';
import { VotesGetProvider } from './providers/votes-get.provider';
import { Property } from '../properties/entities/property.entity';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('VotesService', () => {
  let service: VotesService;
  let voteRepository: Repository<Vote>;
  let propertyRepository: Repository<Property>;
  let propertiesGetProvider: PropertiesGetProvider;
  let propertiesVoSuViProvider: PropertiesVoSuViProvider;
  let votesGetProvider: VotesGetProvider;
  let usersClient = { emit: jest.fn() };
  const VOTE_REPOSITORY_TOKEN = getRepositoryToken(Vote);
  const PROPERTY_REPOSITORY_TOKEN = getRepositoryToken(Property);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: PropertiesGetProvider,
          useValue: {
            getUserIdByProId: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: 'USERS_SERVICE',
          useValue: usersClient,
        },
        {
          provide: PropertiesVoSuViProvider,
          useValue: {
            changeVotesNum: jest.fn(),
          },
        },
        {
          provide: VotesGetProvider,
          useValue: {
            getVoteSpammers: jest.fn(),
            getUsersVotedUp: jest.fn(),
          },
        },
        {
          provide: VOTE_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PROPERTY_REPOSITORY_TOKEN,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);

    voteRepository = module.get<Repository<Vote>>(VOTE_REPOSITORY_TOKEN);
    propertyRepository = module.get<Repository<Property>>(
      PROPERTY_REPOSITORY_TOKEN,
    );
    propertiesGetProvider = module.get<PropertiesGetProvider>(
      PropertiesGetProvider,
    );
    propertiesVoSuViProvider = module.get<PropertiesVoSuViProvider>(
      PropertiesVoSuViProvider,
    );
    votesGetProvider = module.get<VotesGetProvider>(VotesGetProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('changeVoteStatus test', async () => {
    const propertyId = 1;

    const value = -1;

    const userId = 2;

    const property1 = {
      agency: { id: 3 },
    } as Property;

    const property2 = {
      voteScore: 4,
      priorityRatio: { voteRatio: 5, suitabilityRatio: 6 },
    } as Property;

    const findVote = {
      where: { property: { id: propertyId }, user: { id: userId } },
    };

    const saveVote = {
      value: value,
      property: { id: propertyId },
      user: { id: userId },
    } as Vote;

    const updateProperty = {
      priorityRatio: { voteRatio: 3.000434077479318640668921387778 },
      primacy: 9.000434077479318640668921387778,
    } as Property;

    jest
      .spyOn(propertiesGetProvider, 'getUserIdByProId')
      .mockResolvedValueOnce(property1);

    jest.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(null);

    jest.spyOn(voteRepository, 'save').mockResolvedValueOnce(saveVote);

    jest
      .spyOn(propertiesGetProvider, 'findById')
      .mockResolvedValueOnce(property2);
    jest
      .spyOn(service, 'changeAllVotes')
      .mockImplementation(function () {} as any);
    await expect(
      service.changeVoteStatus(propertyId, value, userId),
    ).resolves.toEqual(saveVote);

    expect(propertiesGetProvider.getUserIdByProId).toHaveBeenCalledWith(
      propertyId,
    );

    expect(voteRepository.findOne).toHaveBeenCalledWith(findVote);

    // expect(agenciesVoViProvider.changeVotesNum).toHaveBeenCalledWith(
    //   property1.agency.id,
    //   value,
    // );
    // expect(propertiesVoSuViProvider.changeVotesNum).toHaveBeenCalledWith(
    //   propertyId,
    //   value,
    // );

    expect(voteRepository.save).toHaveBeenCalledWith(saveVote);
  });
  it('changeAllVotes test', async () => {
    const propertyId = 1;
    const value = -1;
    const agencyId = 2;
    const property = {
      voteScore: 3,
      priorityRatio: { voteRatio: 4, suitabilityRatio: 5 },
    } as Property;
    jest
      .spyOn(propertiesGetProvider, 'findById')
      .mockResolvedValueOnce(property);

    await expect(
      service.changeAllVotes(propertyId, value, agencyId),
    ).resolves.toEqual(undefined);

    expect(usersClient.emit).toHaveBeenCalledWith('stats.changeVotesNum', {
      id: agencyId,
      value: value,
    });
    expect(propertiesVoSuViProvider.changeVotesNum).toHaveBeenCalledWith(
      propertyId,
      value,
    );
  });
  it('changePrimacy test', async () => {
    const propertyId = 1;
    const value = -1;
    const property = {
      voteScore: 2,
      priorityRatio: { voteRatio: 3, suitabilityRatio: 4 },
    };
    // const updateVote = {priorityRatio : {voteRatio : }} as Property;
  });
  it('isVote test', async () => {
    const propertyId = 1;
    const userId = 2;
    const findVote = {
      where: { property: { id: propertyId }, user: { id: userId } },
    };
    const isVote = { id: 3 } as Vote;
    const returnVote = true;
    jest.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(isVote);
    await expect(service.isVote(propertyId, userId)).resolves.toEqual(
      returnVote,
    );
  });
});
