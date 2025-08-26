/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Property } from '../entities/property.entity';
import { PropertiesCreateProvider } from './properties-create.provider';
import { PropertiesVoSuViProvider } from './properties-vo-su-vi.provider';
import { title } from 'node:process';
import { GeoQueRpcModule } from '@malaz/contracts/modules/rpc/geo-que-rpc.module';
import {
  FlooringType,
  HeatingType,
  PropertyStatus,
  PropertyType,
  UserType,
} from '@malaz/contracts/utils/enums';
import { User } from 'apps/users-micro/src/users/entities/user.entity';
import { PropertiesGetProvider } from './properties-get.provider';
import { Observable, of, pipe } from 'rxjs';

describe('PropertiesCreateProvider', () => {
  let propertiesCreateProvider: PropertiesCreateProvider;
  let propertiesGetProvider: PropertiesGetProvider;
  let usersClient = { send: jest.fn(), pipe: jest.fn() };
  let translateClient = { send: jest.fn() };
  let propertiesVoSuViProvider: PropertiesVoSuViProvider;
  let dataSource: DataSource;
  let clientProxy = { emit: jest.fn(), send: jest.fn() };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GeoQueRpcModule], // Add
      controllers: [], // Add
      providers: [
        PropertiesCreateProvider,
        {
          provide: PropertiesGetProvider,
          useValue: {
            getProsCount: jest.fn(),
          },
        },
        {
          provide: 'USERS_SERVICE',
          useValue: usersClient,
        },
        {
          provide: PropertiesVoSuViProvider,
          useValue: {
            computeSuitabilityRatio: jest.fn(),
          },
        },

        {
          provide: 'TRANSLATE_SERVICE',
          useValue: translateClient,
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
        {
          provide: 'GEO_SERVICE',
          useValue: clientProxy,
        },
      ], // Add
    }).compile();

    propertiesCreateProvider = moduleRef.get<PropertiesCreateProvider>(
      PropertiesCreateProvider,
    );
    propertiesVoSuViProvider = moduleRef.get<PropertiesVoSuViProvider>(
      PropertiesVoSuViProvider,
    );
    propertiesGetProvider = moduleRef.get<PropertiesGetProvider>(
      PropertiesGetProvider,
    );
    dataSource = moduleRef.get<DataSource>(DataSource);
    // clientProxy = moduleRef.get<ClientProxy>(ClientProxy);
  });

  it('should be defined', () => {
    expect(propertiesCreateProvider).toBeDefined();
  });
  it('create test', async () => {
    const createPropertyDto = {
      title: 'عنوان',
      description: 'وصف',
      isForRent: true,
      price: 2,
      pointsDto: {
        lat: 30.0444,
        lon: 31.2357,
      },
      rooms: 3,
      bathrooms: 1,
      area: 123,
      floorNumber: 1,
      hasGarage: true,
      hasGarden: true,
      heatingType: HeatingType.GAS,
      flooringType: FlooringType.WOOD,
      propertyType: PropertyType.HOUSE,
      isFloor: false,
      agencyId: 1,
    };
    const userId = 1;
    const user = {
      id: 2,
      userType: UserType.AGENCY,
      plan: { id: 3, limit: 4 },
    } as User;
    const find = { where: { agency: { id: userId } } };
    const count = 3;
    const agency = { id: 1 };
    const agencyInfo = { agencyCommissionRate: 6 };
    const propertyCommissionRate =
      createPropertyDto.price * (agencyInfo.agencyCommissionRate ?? 1);
    const create = {
      ...createPropertyDto,
      firstImage: 'https://cdn-icons-png.flaticon.com/512/4757/4757668.png',
      owner: { id: user.id },
      location: {
        lat: createPropertyDto.pointsDto.lat,
        lon: createPropertyDto.pointsDto.lon,
      },
      agency: { id: agency.id },
      propertyCommissionRate: propertyCommissionRate,
    };
    const save = { ...create, status: PropertyStatus.ACCEPTED, id: 9 };
    const translate = {
      ...save,
      multi_description: { ar: 'وصف', en: 'description', de: 'descripitonn' },
      multi_title: { ar: 'عنوان', en: 'title', de: 'titlee' },
    };
    const result = {
      ...translate,
      priorityRatio: { suitabilityRatio: 6, primacy: 7 },
    };
    jest
      .spyOn(usersClient, 'send')
      .mockReturnValueOnce(of(user))
      .mockReturnValueOnce(of(agency as any))
      .mockReturnValueOnce(of(agencyInfo));
    jest
      .spyOn(propertiesGetProvider, 'getProsCount')
      .mockResolvedValueOnce(count);
    jest.spyOn(dataSource, 'transaction').mockResolvedValueOnce(result);
    await expect(
      propertiesCreateProvider.create(createPropertyDto, userId),
    ).resolves.toEqual(result.id);
    expect(usersClient.send).toHaveBeenNthCalledWith(1, 'users.findById', {
      id: userId,
    });
    expect(propertiesGetProvider.getProsCount).toHaveBeenCalledWith(userId);
    expect(usersClient.send).toHaveBeenNthCalledWith(2, 'users.findById', {
      id: createPropertyDto.agencyId,
    });
    expect(usersClient.send).toHaveBeenNthCalledWith(
      3,
      'agencies.getOneAgencyInfo',
      {
        agencyId: createPropertyDto.agencyId,
      },
    );
    expect(dataSource.transaction).toHaveBeenCalled();
    expect(clientProxy.emit).toHaveBeenCalled();
  });
});
