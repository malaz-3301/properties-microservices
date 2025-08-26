/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersGetProvider } from './users-get.provider';
import { UsersOtpProvider } from './users-otp.provider';
import { UsersUpdateProvider } from './users-update.provider';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@malaz/contracts/utils/enums';

describe('UsersUpdateProvider', () => {
  let usersUpdateProvider: UsersUpdateProvider;
  let userRepository: Repository<User>;
  let usersGetProvider: UsersGetProvider;
  let usersOtpProvider: UsersOtpProvider;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        UsersUpdateProvider,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: UsersGetProvider,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: UsersOtpProvider,
          useValue: {
            hashCode: jest.fn(),
          },
        },
      ], // Add
    }).compile();

    usersUpdateProvider =
      moduleRef.get<UsersUpdateProvider>(UsersUpdateProvider);
    userRepository = moduleRef.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    usersGetProvider = moduleRef.get<UsersGetProvider>(UsersGetProvider);
    usersOtpProvider = moduleRef.get<UsersOtpProvider>(UsersOtpProvider);
  });

  it('should be defined', () => {
    expect(usersUpdateProvider).toBeDefined();
  });
  it('updateMe test', async () => {
    const id = 1;
    const updateUserDto = {
      myPassword: 'myPassword',
      password: 'password',
      phone: '0985896698',
      age: 20,
      pointsDto: { lat: 33, lon: 33 },
      token: 'token',
      username: 'mohammed',
    };
    const { myPassword, ...updateDto } = updateUserDto;
    const password = await bcrypt.hash('password', await bcrypt.genSalt(10));
    const user = {
      password: await bcrypt.hash(myPassword, await bcrypt.genSalt(10)),
    };
    const returnValue = { id: id, password: updateUserDto.password };
    updateDto.password = password;
    jest
      .spyOn(usersGetProvider, 'findById')
      .mockResolvedValueOnce(user as any)
      .mockResolvedValueOnce(returnValue as any);
    jest.spyOn(usersOtpProvider, 'hashCode').mockResolvedValueOnce(password);
    await expect(
      usersUpdateProvider.updateMe(id, updateUserDto),
    ).resolves.toEqual(returnValue);
    expect(usersGetProvider.findById).toHaveBeenCalledWith(id);
    expect(usersOtpProvider.hashCode).toHaveBeenCalledWith(
      updateUserDto.password,
    );
    expect(userRepository.update).toHaveBeenCalledWith(id, updateDto);
  });
  it('updateUserById test', async () => {
    const id = 1;
    const update = { age: 22 };
    const user = { userType: UserType.Owner, age: 20 };
    const returnValue = { ...user, ...update };
    jest
      .spyOn(usersGetProvider, 'findById')
      .mockResolvedValueOnce(user as any)
      .mockResolvedValueOnce(returnValue as any);
    await expect(
      usersUpdateProvider.updateUserById(id, update),
    ).resolves.toEqual(returnValue);
    expect(usersGetProvider.findById).toHaveBeenCalledWith(1);
    expect(userRepository.update).toHaveBeenCalledWith(id, update);
  });
  it('upgradeUser test', async () => {
    const userId = 1;
    const user = { id: 2 };
    const update = { userType: UserType.ADMIN };
    const returnValue = {
      generatedMaps: [] as any,
      raw: 1,
      affected: 1,
    };
    jest.spyOn(usersGetProvider, 'findById').mockResolvedValueOnce(user as any);
    jest.spyOn(userRepository, 'update').mockResolvedValueOnce(returnValue);
    await expect(usersUpdateProvider.upgradeUser(userId)).resolves.toEqual(
      returnValue,
    );
    expect(usersGetProvider.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.update).toHaveBeenCalledWith(userId, update);
  });
});
