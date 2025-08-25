/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersOtpProvider } from './users-otp.provider';
import { UsersRegisterProvider } from './users-register-provider';
import * as bcrypt from 'bcryptjs';
import { emit } from 'process';
import { SmsQueRpcModule } from '@malaz/contracts/modules/rpc/sms-que-rpc.module';
import { GeoQueRpcModule } from '@malaz/contracts/modules/rpc/geo-que-rpc.module';

describe('UsersRegisterProvider', () => {
  let usersRegisterProvider: UsersRegisterProvider;
  let userRepository: Repository<User>;
  let i18nService: I18nService;
  let usersOtpProvider: UsersOtpProvider;
  let clientProxy = { emit: jest.fn() };
  let clientProxy2 = { emit: jest.fn() };
  let dataSource: DataSource;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SmsQueRpcModule, GeoQueRpcModule], // Add
      controllers: [], // Add
      providers: [
        UsersRegisterProvider,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
          },
        },
        {
          provide: UsersOtpProvider,
          useValue: {
            hashCode: jest.fn(),
          },
        },
        {
          provide: 'GEO_SERVICE',
          useValue: clientProxy,
        },
        {
          provide: 'SMS_SERVICE',
          useValue: clientProxy2,
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
            query: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    usersRegisterProvider = moduleRef.get<UsersRegisterProvider>(
      UsersRegisterProvider,
    );
    userRepository = moduleRef.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    i18nService = moduleRef.get<I18nService>(I18nService);
    usersOtpProvider = moduleRef.get<UsersOtpProvider>(UsersOtpProvider);
    // clientProxy = moduleRef.get<ClientProxy>(ClientProxy);
    // clientProxy2 = moduleRef.get<ClientProxy>(ClientProxy);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(UsersRegisterProvider).toBeDefined();
  });
  it('register test', async () => {
    const registerUserDto = {
      password: 'mohammed',
      phone: '0985896698',
      pointsDto: { lat: 33, lon: 33 },
      token: 'mohammed',
      username: 'mohammed',
      age: 20,
    };
    const oldPassword = 'mohammed';
    const find = { phone: registerUserDto.phone };
    const result = { id: 2 };
    const message = 'transolation.Key';
    const key = 'Verification code is';
    const returnValue = { message: 'Verify your account', userId: result.id };
    jest
      .spyOn(usersOtpProvider, 'hashCode')
      .mockResolvedValueOnce(registerUserDto.password);
    jest.spyOn(dataSource, 'transaction').mockResolvedValueOnce(result);
    jest.spyOn(i18nService, 't').mockResolvedValueOnce(key as never);
    await expect(
      usersRegisterProvider.register(registerUserDto),
    ).resolves.toEqual(returnValue);
    expect(userRepository.findOneBy).toHaveBeenCalledWith(find);
    console.log(registerUserDto);
    expect(usersOtpProvider.hashCode).toHaveBeenNthCalledWith(1, oldPassword);
    expect(dataSource.transaction).toHaveBeenCalled();
    // expect(clientProxy.emit).toHaveBeenCalled();
    // expect(i18nService.t).toHaveBeenCalledWith(message);
    // expect(clientProxy2.emit).toHaveBeenCalled();
  });
});
