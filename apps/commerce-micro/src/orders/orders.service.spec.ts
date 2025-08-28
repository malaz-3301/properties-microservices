import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Plan } from '../plans/entities/plan.entity';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderStatus } from '@malaz/contracts/utils/enums';

describe('OrdersService', () => {
  let service: OrdersService;
  let planRepo: Repository<Plan>;
  let orderRepo: Repository<Order>;
  let stripe: any;
  let usersClient: any;
  let propertiesClient: any;
  let httpService: HttpService;

  beforeEach(async () => {
    stripe = {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({ id: 'sess_123' }),
        },
      },
      webhooks: {
        constructEvent: jest.fn().mockImplementation(() => ({
          type: 'checkout.session.completed',
          data: {
            object: {
              mode: 'subscription',
              metadata: { userId: '1', planId: '2' },
            },
          },
        })),
      },
    };

    usersClient = { emit: jest.fn() };
    propertiesClient = { send: jest.fn(() => of({ id: 99 })) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(Plan),
          useValue: { findOneBy: jest.fn(), findOne: jest.fn() },
        },
        { provide: 'STRIPE_CLIENT', useValue: stripe },
        { provide: 'USERS_SERVICE', useValue: usersClient },
        { provide: 'PROPERTIES_SERVICE', useValue: propertiesClient },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('whsec_123') },
        },
        { provide: HttpService, useValue: { post: jest.fn() } },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    planRepo = module.get(getRepositoryToken(Plan));
    orderRepo = module.get(getRepositoryToken(Order));
    httpService = module.get<HttpService>(HttpService);
  });

  describe('createPlanStripe', () => {
    it('should throw if plan not found', async () => {
      (planRepo.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(
        service.createPlanStripe({ planId: 1 } as any, 5),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create stripe session if plan found', async () => {
      (planRepo.findOneBy as jest.Mock).mockResolvedValue({
        id: 1,
        planPrice: 100,
        planDuration: '1_month',
        multi_description: { ar: 'خطة' },
      });
      const result = await service.createPlanStripe(
        {
          planId: 1,
          dataAfterPayment: { success_url: 's', cancel_url: 'c' },
        } as any,
        5,
      );
      expect(result).toEqual({ id: 'sess_123' });
      expect(stripe.checkout.sessions.create).toHaveBeenCalled();
    });
  });

  describe('createCommissionStrip', () => {
    it('should create commission stripe session', async () => {
      const property = {
        id: 1,
        propertyCommissionRate: 20,
        multi_title: { ar: 'عنوان' },
        multi_description: { ar: 'وصف' },
      };
      (propertiesClient.send as jest.Mock).mockReturnValue(of(property));
      const result = await service.createCommissionStrip({
        proId: 1,
        dataAfterPayment: { success_url: 's', cancel_url: 'c' },
      } as any);
      expect(result).toEqual({ id: 'sess_123' });
    });
  });

  describe('createHook', () => {
    it('should handle subscription event', async () => {
      jest.spyOn(service, 'setPlanExp').mockResolvedValue(undefined as any);
      await service.createHook('body', 'sig');
      expect(service.setPlanExp).toHaveBeenCalledWith(1, 2);
    });

    it('should throw if constructEvent fails', async () => {
      stripe.webhooks.constructEvent.mockImplementationOnce(() => {
        throw new Error('bad sig');
      });
      await expect(service.createHook('b', 'sig')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('setPlanExp', () => {
    it('should save order and emit event', async () => {
      (planRepo.findOne as jest.Mock).mockResolvedValue({
        planDuration: '1_day',
      });
      (orderRepo.create as jest.Mock).mockReturnValue({ plan: { id: 2 } });
      await service.setPlanExp(1, 2);
      expect(orderRepo.save).toHaveBeenCalled();
      expect(usersClient.emit).toHaveBeenCalledWith('users.setUserPlan', {
        userId: 1,
        planId: 2,
      });
    });

    it('should throw if unsupported unit', async () => {
      (planRepo.findOne as jest.Mock).mockResolvedValue({
        planDuration: '1_year',
      });
      await expect(service.setPlanExp(1, 2)).rejects.toThrow(Error);
    });
  });

  describe('markCommissionPaid', () => {
    it('should call propertiesClient.send', async () => {
      await service.markCommissionPaid(5);
      expect(propertiesClient.send).toHaveBeenCalledWith(
        'properties.markCommissionPaid',
        { proId: 5 },
      );
    });
  });

  describe('getPaymentInfo', () => {
    it('should return data on success', async () => {
      (httpService.post as jest.Mock).mockReturnValue(
        of({ data: { ok: true } }),
      );
      const result = await service.getPaymentInfo({} as any);
      expect(result).toEqual({ ok: true });
    });

    it('should throw HttpException on error', async () => {
      (httpService.post as jest.Mock).mockReturnValue(
        throwError(() => ({ response: { data: 'err', status: 400 } })),
      );
      await expect(service.getPaymentInfo({} as any)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
