import { Test, TestingModule } from '@nestjs/testing';
import { AuthMicroService } from './auth-micro.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersOtpProvider } from '../../users-micro/src/users/providers/users-otp.provider';
import { BannedService } from '../../users-micro/src/banned/banned.service';
import { ClientProxy } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { User } from '../../users-micro/src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('AuthMicroService', () => {
  let service: AuthMicroService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;
  let usersOtpProvider: UsersOtpProvider;
  let bannedService: BannedService;
  let smsClient: ClientProxy;
  let i18n: I18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMicroService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('fakeToken'),
          },
        },
        {
          provide: UsersOtpProvider,
          useValue: {
            otpCreate: jest.fn(),
            hashCode: jest.fn().mockResolvedValue('hashedPassword'),
          },
        },
        {
          provide: BannedService,
          useValue: {
            checkBlock: jest.fn(),
          },
        },
        { provide: 'USERS_SERVICE', useValue: { send: jest.fn() } },
        { provide: 'SMS_SERVICE', useValue: { emit: jest.fn() } },
        {
          provide: I18nService,
          useValue: { t: jest.fn().mockReturnValue('login_success') },
        },
      ],
    }).compile();

    service = module.get<AuthMicroService>(AuthMicroService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    usersOtpProvider = module.get<UsersOtpProvider>(UsersOtpProvider);
    bannedService = module.get<BannedService>(BannedService);
    smsClient = module.get<ClientProxy>('SMS_SERVICE');
    i18n = module.get<I18nService>(I18nService);
  });

  describe('login', () => {
    it('should login with correct credentials', async () => {
      const mockUser = {
        id: 1,
        phone: '123',
        username: 'test',
        password: await bcrypt.hash('password', 10),
        isAccountVerified: true,
        userType: 'USER',
        language: 'en',
      };

      (usersRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (bannedService.checkBlock as jest.Mock).mockResolvedValue(true);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login({
        phone: '123',
        username: 'mohammed',
        password: 'password',
      });

      expect(result).toEqual({
        accessToken: 'fakeToken',
        UserType: 'USER',
      });
      expect(smsClient.emit).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      (usersRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(
        service.login({
          phone: 'not-exist',
          username: 'mohammed',
          password: '123',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const mockUser = {
        id: 1,
        phone: '123',
        username: 'test',
        password: await bcrypt.hash('password', 10),
        isAccountVerified: true,
      };
      (usersRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login({ phone: '123', username: 'mohammed', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetAccount', () => {
    it('should create otp if user found', async () => {
      const mockUser = { id: 1, phone: '123', username: 'test' };
      (usersRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (usersOtpProvider.otpCreate as jest.Mock).mockResolvedValue('otp123');

      const result = await service.resetAccount({
        phone: '123',
        username: 'mohammed',
      });
      expect(result).toBe('otp123');
    });

    it('should throw NotFoundException if user not found', async () => {
      (usersRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(
        service.resetAccount({ phone: 'not-exist', username: 'mohammed' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user if exists', async () => {
      const mockUser = { id: 1, plan: {} };
      (usersRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getCurrentUser(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      (usersRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.getCurrentUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addAdmin', () => {
    it('should save user as admin', async () => {
      const dto = { username: 'admin', phone: '123' };
      (usersRepository.save as jest.Mock).mockResolvedValue({ ...dto, id: 1 });

      const result = await service.addAdmin(dto as any);
      expect(result).toHaveProperty('id', 1);
      expect(usersRepository.save).toHaveBeenCalled();
    });
  });

  describe('changeLanguage', () => {
    it('should update language for user', async () => {
      (usersRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      await service.changeLanguage('ar' as any, 1);
      expect(usersRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        { language: 'ar' },
      );
    });
  });
});
