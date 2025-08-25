import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersRegisterProvider } from './providers/users-register-provider';
import { getOptionsToken } from '@nestjs/throttler';
import { UsersDelProvider } from './providers/users-del.provider';
import { UsersGetProvider } from './providers/users-get.provider';
import { UsersImgProvider } from './providers/users-img.provider';
import { UsersOtpProvider } from './providers/users-otp.provider';
import { UsersUpdateProvider } from './providers/users-update.provider';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let usersRegisterProvider: UsersRegisterProvider;
  let usersOtpProvider: UsersOtpProvider;
  let usersUpdateProvider: UsersUpdateProvider;
  let usersImgProvider: UsersImgProvider;
  let usersGetProvider: UsersGetProvider;
  let usersDelProvider: UsersDelProvider;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: UsersRegisterProvider,
          useValue: { register_back_users: jest.fn(), register: jest.fn() },
        },
        {
          provide: UsersOtpProvider,
          useValue: {
            otpReSend: jest.fn(),
            otpTimer: jest.fn(),
            otpotpVerify: jest.fn(),
          },
        },
        {
          provide: UsersUpdateProvider,
          useValue: { updateMe: jest.fn(), updateUserById: jest.fn() , upgradeUser: jest.fn() },
        },
        {
          provide: UsersImgProvider,
          useValue: { setProfileImage: jest.fn(), removeProfileImage: jest.fn() },
        },
        {
          provide: UsersGetProvider,
          useValue: { findById: jest.fn(), getUserProsById: jest.fn() },
        },
        {
          provide: UsersDelProvider,
          useValue: { deleteMe: jest.fn(), deleteUserById: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    usersRegisterProvider = module.get<UsersRegisterProvider>(UsersRegisterProvider,);
    usersOtpProvider = module.get<UsersOtpProvider>(UsersOtpProvider,);
    usersUpdateProvider = module.get<UsersUpdateProvider>(UsersUpdateProvider,);
    usersImgProvider = module.get<UsersImgProvider>(UsersImgProvider,);
    usersGetProvider = module.get<UsersGetProvider>(UsersGetProvider,);
    usersDelProvider = module.get<UsersDelProvider>(UsersDelProvider,);
  });

  it('should be defined', () => {expect(service).toBeDefined();});
});
