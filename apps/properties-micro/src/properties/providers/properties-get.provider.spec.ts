/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { FavoriteService } from '../../favorite/favorite.service';
import { VotesService } from '../../votes/votes.service';
import {
  Repository,
  DataSource,
  FindOneOptions,
  FindOperator,
  Between,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
} from 'typeorm';
import { Property } from '../entities/property.entity';
import { PropertiesGetProvider } from './properties-get.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { createHash } from 'node:crypto';
import { firstValueFrom, Observable, of } from 'rxjs';
import { agent } from 'supertest';
import { GeoQueRpcModule } from '@malaz/contracts/modules/rpc/geo-que-rpc.module';
import {
  GeoEnum,
  HeatingType,
  Language,
  OrderDir,
  PropertyStatus,
  PropertyType,
  UserType,
} from '@malaz/contracts/utils/enums';
import { NearProDto } from '@malaz/contracts/dtos/properties/properties/near-pro.dto';
import { json } from 'body-parser';

describe('PropertiesGetProvider', () => {
  let propertiesGetProvider: PropertiesGetProvider;
  let propertyRepository: Repository<Property>;
  const PROPERTY_REPOSITORY_TOKEN = getRepositoryToken(Property);
  let favoriteService: FavoriteService;
  let votesService: VotesService;
  let dataSource: DataSource;
  let clientProxy = { send: jest.fn() };
  let usersClient = { send: jest.fn() };
  let translateClient = { send: jest.fn() };
  let i18nService: I18nService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GeoQueRpcModule, CacheModule.register()], // Add
      controllers: [], // Add
      providers: [
        PropertiesGetProvider,
        {
          provide: PROPERTY_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: FavoriteService,
          useValue: {
            isFavorite: jest.fn(),
          },
        },
        {
          provide: VotesService,
          useValue: {
            isVote: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
          },
        },
        {
          provide: 'GEO_SERVICE',
          useValue: clientProxy,
        },
        {
          provide: 'USERS_SERVICE',
          useValue: usersClient,
        },

        {
          provide: 'TRANSLATE_SERVICE',
          useValue: translateClient,
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    propertiesGetProvider = moduleRef.get<PropertiesGetProvider>(
      PropertiesGetProvider,
    );
    propertyRepository = moduleRef.get<Repository<Property>>(
      PROPERTY_REPOSITORY_TOKEN,
    );
    favoriteService = moduleRef.get<FavoriteService>(FavoriteService);
    votesService = moduleRef.get<VotesService>(VotesService);
    dataSource = moduleRef.get<DataSource>(DataSource);
    // clientProxy = moduleRef.get<ClientProxy>(ClientProxy);
    i18nService = moduleRef.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(propertiesGetProvider).toBeDefined();
  });
  it('getProByUser test', async () => {
    const propertyId = 1;
    const userId = 2;
    const role = UserType.AGENCY;
    const find = {
      where: { id: propertyId, [role]: { id: userId } },
    };
    const property = {
      multi_description: { ar: 'وصف', en: 'description', de: 'descriptionn' },
      multi_title: { ar: 'عنوان', en: 'title', de: 'titlee' },
    };
    const user = { language: Language.ARABIC };
    const returnValue = {
      ...property,
      description: property.multi_description.ar,
      title: property.multi_title.ar,
    };
    jest
      .spyOn(propertyRepository, 'findOne')
      .mockResolvedValueOnce(property as any);
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(returnValue));
    await expect(
      propertiesGetProvider.getProByUser(propertyId, userId, role),
    ).resolves.toEqual(returnValue);
    expect(propertyRepository.findOne).toHaveBeenCalledWith(find);
    expect(usersClient.send).toHaveBeenCalledWith('users.findById', {
      id: userId,
    });
    expect(translateClient.send).toHaveBeenCalledWith(
      'translate.getTranslatedProperty',
      {
        property: property,
        language: user.language,
      },
    );
  });
  it('getUserIdByProId test', async () => {
    const propertyId = 1;
    const find = {
      where: { id: propertyId },
      relations: { agency: true },
      select: { agency: { id: true, phone: true } },
    };
    const property = {
      multi_description: { ar: 'وصف', en: 'description', de: 'descriptionn' },
      multi_title: { ar: 'عنوان', en: 'title', de: 'titlee' },
    };
    jest
      .spyOn(propertyRepository, 'findOne')
      .mockResolvedValueOnce(property as any);
    await expect(
      propertiesGetProvider.getUserIdByProId(propertyId),
    ).resolves.toEqual(property);
    expect(propertyRepository.findOne).toHaveBeenCalledWith(find);
  });
  it('findById test', async () => {
    const propertyId = 1;
    const find = {
      where: { id: propertyId },
      relations: { agency: true },
      select: { agency: { id: true, username: true } },
    };
    const property = {
      multi_description: { ar: 'وصف', en: 'description', de: 'descriptionn' },
      multi_title: { ar: 'عنوان', en: 'title', de: 'titlee' },
    };
    jest
      .spyOn(propertyRepository, 'findOne')
      .mockResolvedValueOnce(property as any);
    await expect(propertiesGetProvider.findById(propertyId)).resolves.toEqual(
      property,
    );
    expect(propertyRepository.findOne).toHaveBeenCalledWith(find);
  });
  it('findById_ACT test', async () => {
    const propertyId = 1;
    const userId = 2;
    const find = {
      where: { id: propertyId },
      relations: { agency: true },
      select: { agency: { id: true, username: true } },
    };
    const property = {
      panoramaImages: JSON.stringify({ mohammed: 'mohammed', ahmed: 'ahmed' }),
      propertyType: PropertyType.HOUSE,
      multi_description: { ar: 'وصف', en: 'description', de: 'descriptionn' },
      multi_title: { ar: 'عنوان', en: 'title', de: 'titlee' },
      firstImage: 'adl',
    };
    console.log(typeof property.panoramaImages);
    console.log(JSON.parse(property.panoramaImages));
    const user = { language: Language.ARABIC };
    const translate = { ...property, description: 'وصف', title: 'عنوان' };
    const isFavorite = true;
    const voteValue = true;
    const { panoramaImages, firstImage, ...propertyE } = property;
    const panoramaImagesParse = JSON.parse(property.panoramaImages);
    const returnValue = {
      ...translate,
      firstImage: undefined,
      panoramaImages: panoramaImagesParse,
      isFavorite,
      voteValue,
    };
    jest
      .spyOn(propertyRepository, 'findOne')
      .mockResolvedValueOnce(property as any);
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(translate));
    jest.spyOn(favoriteService, 'isFavorite').mockResolvedValueOnce(isFavorite);
    jest.spyOn(votesService, 'isVote').mockResolvedValueOnce(voteValue);
    await expect(
      propertiesGetProvider.findById_ACT(propertyId, userId),
    ).resolves.toEqual(returnValue);
    expect(propertyRepository.findOne).toHaveBeenCalledWith(find);
    expect(usersClient.send).toHaveBeenCalledWith('users.findById', {
      id: userId,
    });
    expect(translateClient.send).toHaveBeenCalledWith(
      'translate.getTranslatedProperty',
      {
        property: property,
        language: user.language,
      },
    );
    expect(favoriteService.isFavorite).toHaveBeenCalledWith(userId, propertyId);
    expect(votesService.isVote).toHaveBeenCalledWith(propertyId, userId);
  });
  it('shortHash test', async () => {
    const obj = { id: 1 };
    const returnValue = createHash('md5')
      .update(JSON.stringify(obj))
      .digest('hex');
    await expect(propertiesGetProvider.shortHash(obj)).resolves.toEqual(
      returnValue,
    );
  });
  it('getProByGeo test', async () => {
    const geoProDto = { geoLevel: GeoEnum.CITY, lat: 33, lon: 33 };
    const userId = 3;
    const geo = 'get_property.geo';
    const { geoLevel, ...geoSearch } = geoProDto;
    const location = of({
      city: 'city',
      quarter: 'quarter',
      street: 'street',
      country: 'country',
      governorate: 'governorate',
    });

    const find = { where: { location: { city: 'city' } } };
    const properties = [
      {
        multi_description: {
          ar: 'وصف1',
          en: 'description1',
          de: 'descriptionn1',
        },
        multi_title: { ar: 'عنوان1', en: 'title1', de: 'titlee1' },
      },
      {
        multi_description: {
          ar: 'وصف2',
          en: 'description2',
          de: 'description2',
        },
        multi_title: { ar: 'عنوان2', en: 'title2', de: 'titlee2' },
      },
    ];
    const user = { language: Language.ARABIC };
    const translate = properties.map(function (property) {
      property['description'] = property.multi_description.ar;
      property['title'] = property.multi_title.ar;
      return property;
    });
    jest.spyOn(clientProxy, 'send').mockReturnValueOnce(location as never);
    jest
      .spyOn(propertyRepository, 'find')
      .mockResolvedValueOnce(properties as any);
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(translate));
    await expect(
      propertiesGetProvider.getProByGeo(geoProDto, userId),
    ).resolves.toEqual(translate);
  });
  it('getProNearMe test', async () => {
    const nearProDto = { distanceKm: 1, lat: 2, lon: 3 } as NearProDto;
    const userId = 4;
    const query = `
          SELECT *,
                 ST_Distance(
                         "locationStringpoints",
                         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
                 ) AS distance
          FROM property
          WHERE ST_DWithin(
                        "locationStringpoints",
                        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                        $3
                )
          ORDER BY distance ASC;
      `;
    const result = [
      {
        multi_description: {
          ar: 'وصف',
          en: 'description1',
          de: 'descriptionn1',
        },
        multi_title: { ar: 'عنوان', en: 'title1', de: 'titlee1' },
      },
      {
        multi_description: {
          ar: 'وصف وصف',
          en: 'description2',
          de: 'descriptionn2',
        },
        multi_title: { ar: 'عنوان عنوان', en: 'title2', de: 'titlee2' },
      },
    ];
    const user = { language: Language.ARABIC };
    const translate = result.map(function (property) {
      const description = property.multi_description[user.language];
      const title = property.multi_title[user.language];
      return { ...property, description, title };
    });
    jest.spyOn(dataSource, 'query').mockResolvedValueOnce(result);
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(translate));
    await expect(
      propertiesGetProvider.getProNearMe(nearProDto, userId),
    ).resolves.toEqual(translate);
    expect(usersClient.send).toHaveBeenCalledWith('users.findById', {
      id: userId,
    });
    expect(translateClient.send).toHaveBeenCalledWith(
      'translate.getTranslatedProperties',
      {
        property: result,
        language: user.language,
      },
    );
  });
  it('getAll test', async () => {
    const query = {
      hasGarage: true,
      heatingType: HeatingType.GAS,
      isFloor: true,
      minArea: '1',
      maxArea: '2',
      numPerPage: 1,
      pageNum: 1,
      propertyType: PropertyType.HOUSE,
      bathrooms: 3,
      createdDir: OrderDir.ASC,
      isForRent: true,
      minPrice: 4,
      maxPrice: 5,
      priceDir: OrderDir.ASC,
      rooms: 6,
      status: PropertyStatus.ACCEPTED,
      word: 'mohammed',
    };
    const userId = 3;
    const ownerId = 6;
    const agencyId = 9;
    const price = Between(query.minPrice, query.maxPrice);
    const area = Between(parseInt(query.minArea), parseInt(query.maxArea));
    const filter: FindOptionsWhere<Property> | undefined = {};
    filter.price = price;
    filter.area = area;
    if (query.status != null) filter.status = query.status;
    if (query.propertyType != null) filter.propertyType = query.propertyType;
    if (query.heatingType != null) filter.heatingType = query.heatingType;
    if (query.rooms != null) filter.rooms = query.rooms;
    if (query.bathrooms != null) filter.bathrooms = query.bathrooms;
    if (query.isForRent != null) filter.isForRent = query.isForRent;
    if (query.hasGarage != null) filter.hasGarage = query.hasGarage;
    if (query.isFloor != null) filter.isFloor = query.isFloor;
    if (agencyId != null) filter.agency = { id: agencyId };
    if (ownerId != null) filter.owner = { id: ownerId };
    let where: FindOptionsWhere<Property>[];
    if (query.word) {
      where = [
        { ...filter, multi_title: Like(`%${query.word}%`) },
        { ...filter, multi_description: Like(`%${query.word}%`) },
      ];
    } else {
      where = [filter];
    }
    const order: FindOptionsOrder<Property> | undefined = {};
    if (query.createdDir == null && query.priceDir == null) {
      order.primacy = 'DESC';
    }
    if (query.createdDir != null) {
      order.createdAt = query.createdDir;
    }
    if (query.priceDir != null) {
      order.price = query.priceDir;
    }
    const find = {
      where,
      skip: query.numPerPage * (query.pageNum - 1), //pagination
      take: query.numPerPage,
      relations: { agency: true, favorites: true },
      select: {
        favorites: { id: true },
        id: true,
        multi_title: true,
        rooms: true,
        bathrooms: true,
        primacy: true,
        createdAt: true,
        area: true,
        price: true,
        firstImage: true,
        status: true,
        isForRent: true,
        propertyType: true,
        location: {
          country: true,
          governorate: true,
          city: true,
          quarter: true,
          street: true,
          lon: true,
          lat: true,
        },
        agency: { username: true },
      },
      order,
    };
    const properties = [
      {
        multi_description: {
          ar: 'وصف',
          en: 'description1',
          de: 'descriptionn1',
        },
        multi_title: { ar: 'عنوان', en: 'title1', de: 'titlee1' },
      },
      {
        multi_description: {
          ar: 'وصف وصف',
          en: 'description2',
          de: 'descriptionn2',
        },
        multi_title: { ar: 'عنوان عنوان', en: 'title2', de: 'titlee2' },
      },
    ];
    const user = { language: Language.ARABIC };
    const translate = properties.map(function (property) {
      property['description'] = property.multi_description[user.language];
      property['title'] = property.multi_title[user.language];
      return property;
    });
    jest
      .spyOn(propertiesGetProvider, 'rangeConditions')
      .mockImplementationOnce(function () {
        return price;
      })
      .mockImplementationOnce(function () {
        return area;
      });
    jest
      .spyOn(propertyRepository, 'find')
      .mockResolvedValueOnce(properties as any);
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(translate));
    await expect(
      propertiesGetProvider.getAll(query as any, userId, ownerId, agencyId),
    ).resolves.toEqual(translate);
    expect(propertiesGetProvider.rangeConditions).toHaveBeenNthCalledWith(
      1,
      query.minPrice,
      query.maxPrice,
    );
    expect(propertiesGetProvider.rangeConditions).toHaveBeenNthCalledWith(
      2,
      query.minArea,
      query.maxArea,
    );
    expect(propertyRepository.find).toHaveBeenCalledWith(find);
    expect(usersClient.send).toHaveBeenCalledWith('users.findById', {
      id: userId,
    });
    expect(translateClient.send).toHaveBeenCalledWith(
      'translate.getTranslatedProperties',
      {
        property: properties,
        language: user.language,
      },
    );
  });
  it('rangeConditions test', async () => {
    const min = '1';
    const max = '2';
    const returnValue = Between(parseInt(min), parseInt(max));
    expect(propertiesGetProvider.rangeConditions(min, max)).toEqual(
      returnValue,
    );
  });
  it('getTopScorePro test', async () => {
    const limit = 1;
    const find = {
      order: { voteScore: 'DESC' },
      take: limit,
    };
    const properties = [{ id: 2 }, { id: 3 }];
    jest
      .spyOn(propertyRepository, 'find')
      .mockResolvedValueOnce(properties as any);
    await expect(propertiesGetProvider.getTopScorePro(limit)).resolves.toEqual(
      properties,
    );
    expect(propertyRepository.find).toHaveBeenCalledWith(find);
  });
  it('getOwnerAndAgency test', async () => {
    const id = 1;
    const find = {
      where: { id: id },
      relations: ['agency', 'owner'],
      select: { owner: { id: true }, agency: { id: true } },
    };
    const property = { id: 2 };
    jest
      .spyOn(propertyRepository, 'findOne')
      .mockResolvedValueOnce(property as any);
    await expect(propertiesGetProvider.getOwnerAndAgency(id)).resolves.toEqual(
      property,
    );
    expect(propertyRepository.findOne).toHaveBeenCalledWith(find);
  });
});
