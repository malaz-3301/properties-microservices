/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/
import { ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { PropertiesGetProvider } from './properties-get.provider';
import { PropertiesUpdateProvider } from './properties-update.provider';
import { SmsQueRpcModule } from '@malaz/contracts/modules/rpc/sms-que-rpc.module';
import {
  Language,
  PropertyStatus,
  UserType,
} from '@malaz/contracts/utils/enums';
import { UpdatePropertyDto } from '@malaz/contracts/dtos/properties/properties/update-property.dto';
import { EditProAgencyDto } from '@malaz/contracts/dtos/properties/properties/edit-pro-agency.dto';
import { of } from 'rxjs';
describe('PropertiesUpdateProvider', () => {
  let propertiesUpdateProvider: PropertiesUpdateProvider;
  let propertyRepository: Repository<Property>;
  let propertiesGetProvider: PropertiesGetProvider;
  let usersClient = { send: jest.fn() };
  let translateClient = { send: jest.fn() };
  let clientProxy = { emit: jest.fn() };
  let i18nService: I18nService;
  const PROPERTY_REPOSITORY_TOKEN = getRepositoryToken(Property);
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SmsQueRpcModule], // Add
      controllers: [], // Add
      providers: [
        PropertiesUpdateProvider,
        {
          provide: PROPERTY_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: PropertiesGetProvider,
          useValue: {
            getProByUser: jest.fn(),
            findById: jest.fn(),
          },
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
          provide: 'SMS_SERVICE',
          useValue: clientProxy,
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
          },
        },
      ], // Add
    }).compile();
    propertiesUpdateProvider = moduleRef.get<PropertiesUpdateProvider>(
      PropertiesUpdateProvider,
    );
    propertyRepository = moduleRef.get<Repository<Property>>(
      PROPERTY_REPOSITORY_TOKEN,
    );
    propertiesGetProvider = moduleRef.get<PropertiesGetProvider>(
      PropertiesGetProvider,
    );
    // clientProxy = moduleRef.get<ClientProxy>('SMS_SERVICE');
    i18nService = moduleRef.get<I18nService>(I18nService);
  });
  it('should be defined', () => {
    expect(propertiesUpdateProvider).toBeDefined();
  });
  it('updateOwnerPro test', async () => {
    const propertyId = 1;
    const ownerId = 2;
    const updatePropertyDto = { title: 'عنوان' } as UpdatePropertyDto;
    const userType = UserType.Owner;
    const property = {
      status: PropertyStatus.PENDING,
      multi_title: { ar: '', en: '', de: '' },
    } as any;
    const translate = {
      ...property,
      multi_title: { ar: 'عنوان', en: 'title', de: 'titlee' },
    };
    const save = { ...translate, ...updatePropertyDto };
    const { title, ...returnValue } = save;
    jest
      .spyOn(propertiesGetProvider, 'getProByUser')
      .mockResolvedValueOnce(property as any);
    jest
      .spyOn(propertyRepository, 'save')
      .mockResolvedValueOnce(returnValue as any);
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(translate));
    await expect(
      propertiesUpdateProvider.updateOwnerPro(
        propertyId,
        ownerId,
        updatePropertyDto,
      ),
    ).resolves.toEqual(returnValue);
    expect(propertiesGetProvider.getProByUser).toHaveBeenCalledWith(
      propertyId,
      ownerId,
      userType,
    );
    expect(propertyRepository.save).toHaveBeenCalledWith(save);
  });
  it('updateAgencyPro test', async () => {
    const propertyId = 1;
    const agencyId = 2;
    const editProAgencyDto = { title: 'عنوان' } as EditProAgencyDto;
    const userType = UserType.AGENCY;
    const property = {
      id: 3,
      multi_title: { ar: '', en: '', de: '' },
    } as any;
    const translate = {
      ...property,
      multi_title: { ar: 'عنوان', en: 'title', de: 'titlee' },
    };
    const save = { ...translate, ...editProAgencyDto };
    const { titel, ...returnValue } = save;
    jest
      .spyOn(propertiesGetProvider, 'getProByUser')
      .mockResolvedValueOnce(property);
    jest
      .spyOn(propertyRepository, 'save')
      .mockResolvedValueOnce(returnValue as any);
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(translate));
    await expect(
      propertiesUpdateProvider.updateAgencyPro(
        propertyId,
        agencyId,
        editProAgencyDto,
      ),
    ).resolves.toEqual(returnValue);
    expect(propertiesGetProvider.getProByUser).toHaveBeenCalledWith(
      propertyId,
      agencyId,
      userType,
    );
    expect(propertyRepository.save).toHaveBeenCalledWith(save);
  });
  it('acceptAgencyPro test', async () => {
    const propertyId = 1;
    const agencyId = 2;
    const userType = UserType.AGENCY;
    const property = { owner: { id: 3 } };
    const update = { status: PropertyStatus.ACCEPTED };
    const user = { language: Language.ARABIC, phone: '0985896698' };
    const accept = 'رسالة';
    const message = 'transolation.AcceptMessage';
    const language = { lang: user.language };
    jest
      .spyOn(propertiesGetProvider, 'getProByUser')
      .mockResolvedValueOnce(property as any);
    jest
      .spyOn(propertyRepository, 'update')
      .mockResolvedValueOnce(update as any);
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest.spyOn(i18nService, 't').mockResolvedValueOnce(accept as never);
    await expect(
      propertiesUpdateProvider.acceptAgencyPro(propertyId, agencyId),
    ).resolves.toEqual(update);
    expect(propertiesGetProvider.getProByUser).toHaveBeenCalledWith(
      propertyId,
      agencyId,
      userType,
    );
    expect(usersClient.send).toHaveBeenCalledWith('users.findById', {
      id: property.owner.id,
    });
    expect(i18nService.t).toHaveBeenCalledWith(message, language);
    expect(clientProxy.emit).toHaveBeenCalled();
  });
  it('rejectAgencyPro test', async () => {
    const propertyId = 1;
    const agencyId = 2;
    const userType = UserType.AGENCY;
    const property = { owner: { id: 3 } };
    const update = { status: PropertyStatus.Rejected };
    const user = { language: Language.ARABIC, phone: '0985896698' };
    const message = 'transolation.RejectMessage';
    const language = { lang: user.language };
    const reject = 'رسالة';
    jest
      .spyOn(propertiesGetProvider, 'getProByUser')
      .mockResolvedValueOnce(property as any);
    jest
      .spyOn(propertyRepository, 'update')
      .mockResolvedValueOnce(update as never);
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest.spyOn(i18nService, 't').mockResolvedValueOnce(reject as never);
    await expect(
      propertiesUpdateProvider.rejectAgencyPro(propertyId, agencyId),
    ).resolves.toEqual(update);
    expect(propertiesGetProvider.getProByUser).toHaveBeenCalledWith(
      propertyId,
      agencyId,
      userType,
    );
    expect(propertyRepository.update).toHaveBeenCalledWith(propertyId, update);
    expect(usersClient.send).toHaveBeenCalledWith('users.findById', {
      id: property.owner.id,
    });
    expect(i18nService.t).toHaveBeenCalledWith(message, language);
    expect(clientProxy.emit).toHaveBeenCalled();
  });
  it('updateAdminPro test', async () => {
    const propertyId = 1;
    const update = { title: 'عنوان' };
    const property = { multi_title: { ar: '', en: '', de: '' } };
    const translate = {
      ...property,
      multi_title: { ar: update.title, en: 'title', de: 'titlee' },
    };
    const save = { ...translate, ...update };
    const { title, ...returnValue } = save;
    jest
      .spyOn(propertiesGetProvider, 'findById')
      .mockResolvedValueOnce(property as any);
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(translate));
    jest
      .spyOn(propertyRepository, 'save')
      .mockResolvedValueOnce(returnValue as any);
    await expect(
      propertiesUpdateProvider.updateAdminPro(propertyId, update),
    ).resolves.toEqual(returnValue);
    expect(propertiesGetProvider.findById).toHaveBeenCalledWith(propertyId);
    expect(propertyRepository.save).toHaveBeenCalledWith(save);
    expect(translateClient.send).toHaveBeenCalledWith(
      'translate.updateTranslatedProperty',
      {
        property: property,
        propertyDto: update,
      },
    );
  });
  it('markCommissionPaid test', async () => {
    const propertyId = 1;
    const update = { commissionPaid: true };
    jest
      .spyOn(propertyRepository, 'update')
      .mockResolvedValueOnce(update as any);
    await expect(
      propertiesUpdateProvider.markCommissionPaid(propertyId),
    ).resolves.toEqual(update);
    expect(propertyRepository.update).toHaveBeenCalledWith(propertyId, update);
  });
});
