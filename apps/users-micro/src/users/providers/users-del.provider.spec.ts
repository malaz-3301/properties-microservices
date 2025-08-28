/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { UsersDelProvider } from './users-del.provider';
import { UsersGetProvider } from './users-get.provider';
import { UsersOtpProvider } from './users-otp.provider';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

describe('UsersDelProvider', () => {
  let usersDelProvider: UsersDelProvider;
  let usersGetProvider: UsersGetProvider;
  let usersOtpProvider: UsersOtpProvider;
  let userRepository: Repository<User>;
  const USERS_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        UsersDelProvider,
        { provide: UsersGetProvider, useValue: { findById: jest.fn() } },
        { provide: UsersOtpProvider, useValue: { sendSms: jest.fn() } },
        { provide: USERS_REPOSITORY_TOKEN, useValue: { delete: jest.fn() } },
      ], // Add
    }).compile();

    usersDelProvider = moduleRef.get<UsersDelProvider>(UsersDelProvider);
    usersGetProvider = moduleRef.get<UsersGetProvider>(UsersGetProvider);
    usersOtpProvider = moduleRef.get<UsersOtpProvider>(UsersOtpProvider);
    userRepository = moduleRef.get<Repository<User>>(USERS_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(usersDelProvider).toBeDefined();
  });
  it('deleteMe test', async () => {
    const id = 1;
    const password = 'password';
    const user = {
      password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
    };
    const returnValue = { raw: 1, affected: 1 };
    jest.spyOn(usersGetProvider, 'findById').mockResolvedValueOnce(user as any);
    jest.spyOn(userRepository, 'delete').mockResolvedValueOnce(returnValue);
    await expect(usersDelProvider.deleteMe(id, password)).resolves.toEqual(
      user,
    );
    expect(usersGetProvider.findById).toHaveBeenCalledWith(id);
    expect(userRepository.delete).toHaveBeenCalledWith(id);
  });
  it('deleteUserById test', async() => {
    const id = 1
    const message = 'message'

  })
});
