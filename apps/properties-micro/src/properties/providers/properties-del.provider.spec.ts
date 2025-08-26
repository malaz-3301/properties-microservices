/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { PropertiesDelProvider } from './properties-del.provider';
import { PropertiesGetProvider } from './properties-get.provider';
import * as bcrypt from 'bcryptjs';
describe('PropertiesDelProvider', () => {
  let propertiesDelProvider: PropertiesDelProvider;
  let propertyRepository: Repository<Property>;
  let propertiesGetProvider: PropertiesGetProvider;
  let analyticsClient = { emit: jest.fn() };
  const PROPERTY_REPOSITORY_TOKEN = getRepositoryToken(Property);
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        PropertiesDelProvider,
        {
          provide: PROPERTY_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: PropertiesGetProvider,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: 'ANALYTICS_SERVICE',
          useValue: analyticsClient,
        },
      ], // Add
    }).compile();

    propertiesDelProvider = moduleRef.get<PropertiesDelProvider>(
      PropertiesDelProvider,
    );
    propertyRepository = moduleRef.get<Repository<Property>>(
      PROPERTY_REPOSITORY_TOKEN,
    );
    propertiesGetProvider = moduleRef.get<PropertiesGetProvider>(
      PropertiesGetProvider,
    );
  });

  it('should be defined', () => {
    expect(propertiesDelProvider).toBeDefined();
  });
  it('deleteOwnerPro test', async () => {
    const propertyId = 1;
    const ownerId = 2;
    const password = 'mohammed';
    const find = {
      where: { id: propertyId, owner: { id: ownerId } },
      relations: { owner: true },
      select: { owner: { password: true } },
    };
    const property = {
      owner: {
        password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
      },
    };
    const value = -1;
    const findDelete = { id: propertyId };
    const returnValue = { raw: 1, affected: 1 };
    jest
      .spyOn(propertyRepository, 'findOne')
      .mockResolvedValueOnce(property as any);
    jest.spyOn(propertyRepository, 'delete').mockResolvedValueOnce(returnValue);
    await expect(
      propertiesDelProvider.deleteOwnerPro(propertyId, ownerId, password),
    ).resolves.toEqual(returnValue);
    expect(propertyRepository.findOne).toHaveBeenCalledWith(find);
    expect(analyticsClient.emit).toHaveBeenCalledWith(
      'analytics.chanePropertiesNum',
      {
        userId: ownerId,
        value: -1,
      },
    );
    expect(propertyRepository.delete).toHaveBeenCalledWith(findDelete);
  });
  it('deleteProById test', async () => {
    const id = 1;
    const property = { id: 1 };
    const find = { id: id };
    const returnValue = { raw: 1, affected: 1 } as DeleteResult;
    jest
      .spyOn(propertiesGetProvider, 'findById')
      .mockResolvedValueOnce(property as any);
    jest.spyOn(propertyRepository, 'delete').mockResolvedValueOnce(returnValue);
    await expect(propertiesDelProvider.deleteProById(id)).resolves.toEqual(
      returnValue,
    );
    expect(propertiesGetProvider.findById).toHaveBeenCalledWith(id);
    expect(propertyRepository.delete).toHaveBeenCalledWith(find);
  });
});
