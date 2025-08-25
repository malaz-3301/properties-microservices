/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';
import { VotesGetProvider } from './votes-get.provider';

describe('VotesGetProvider', () => {
  let votesGetProvider: VotesGetProvider;
  let voteRepository: Repository<Vote>;
  const VOTE_REPOSITORY_TOKEN = getRepositoryToken(Vote);
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        VotesGetProvider,
        {
          provide: VOTE_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    votesGetProvider = moduleRef.get<VotesGetProvider>(VotesGetProvider);
    voteRepository = moduleRef.get<Repository<Vote>>(VOTE_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(votesGetProvider).toBeDefined();
  });
  it('getUsersVotedUp test', async () => {
    const propertyId = 1;
    const find = {
      where: { property: { id: propertyId }, value: 1 },
      relations: { user: true },
      select: { user: { username: true, profileImage: true } },
    };
    const returnValue = [{ id: 2 }, { id: 3 }];
    jest
      .spyOn(voteRepository, 'find')
      .mockResolvedValueOnce(returnValue as any);
    await expect(votesGetProvider.getUsersVotedUp(propertyId)).resolves.toEqual(
      returnValue,
    );
    expect(voteRepository.find).toHaveBeenCalledWith(find);
  });
  it('getVoteSpammers test', async () => {
    const find = {
      relations: { user: true },
      select: { user: { id: true, username: true }, createdAt: true },
    };
    const date = new Date();
    const votes = new Array(111);
    for (let i = 0; i < 100; i++) {
      votes[i] = { createdAt: date, user: { id: 1, username: 'mohammed' } };
    }
    for (let i = 100; i < 111; i++) {
      votes[i] = { createdAt: date, user: { id: 1, username: 'mohammed' } };
    }
    const returnValue = [{ id: 1, username: 'mohammed' }];
    jest.spyOn(voteRepository, 'find').mockResolvedValueOnce(votes as any);
    await expect(votesGetProvider.getVoteSpammers()).resolves.toEqual(
      returnValue,
    );
    expect(voteRepository.find).toHaveBeenCalledWith(find);
  });
});
