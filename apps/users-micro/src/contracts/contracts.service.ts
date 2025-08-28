import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import {
  Between,
  FindManyOptions,
  FindOperator,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { NotificationsMicroService } from '../../../notifications-micro/src/notifications-micro.service';
import { CreateContractDto } from '@malaz/contracts/dtos/users/contracts/create-contract.dto';
import { UpdateContractDto } from '@malaz/contracts/dtos/users/contracts/update-contract.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserType } from '@malaz/contracts/utils/enums';
import { User } from '../users/entities/user.entity';
@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {}
  async create(userId: number, createContractDto: CreateContractDto) {
    const isActive = await this.contractRepository.findOne({
      where: {
        property: { id: createContractDto.propertyId },
        expireIn: MoreThan(new Date()),
      },
    });
    if (isActive) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Property is busy now',
      });
    }
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + createContractDto.time);

    const returnValue = await this.contractRepository.save({
      ...createContractDto,
      expireIn: validUntil,
      property: { id: createContractDto.propertyId },
      agency: { id: userId },
    });
    console.log(returnValue);
    this.notificationsClient.emit(
      'notifications.sendNotificationForAllSidesInProperties',
      {
        contract: returnValue,
        message: 'RentedSuccessfully',
      },
    );
    return returnValue;
  }
  findAll() {
    return this.contractRepository.find();
  }
  async findOne(id: number, userType: UserType, userId: number) {
    if (userType == UserType.ADMIN)
      return this.contractRepository.findOne({ where: { id } });
    else {
      const returnValue = (await this.getContracts(userId, { id }))[0];
      console.log(returnValue);
      if (!returnValue) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'not found property',
        });
      }
      return returnValue;
    }
  }
  update(id: number, updateContractDto: UpdateContractDto) {
    if (updateContractDto.time) {
      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + updateContractDto.time);
      return this.contractRepository.update(id, {
        price: updateContractDto.price,
        expireIn: validUntil,
      });
    }
  }
  remove(id: number) {
    return this.contractRepository.delete(id);
  }
  async getMyActiveContracts(userId: number) {
    return this.getContracts(userId, {
      expireIn: MoreThan(new Date()),
    });
  }
  async getMyExpiredContracts(userId: number) {
    return this.getContracts(userId, {
      expireIn: LessThan(new Date()),
    });
  }
  async getMyContracts(userId: number) {
    const active = await this.getMyActiveContracts(userId);
    const expired = await this.getMyExpiredContracts(userId);
    return { active: active, expired: expired };
  }
  expiredAfterWeek() {
    const today = new Date();
    const afterWeek = new Date();
    today.setDate(today.getDate() + 7);
    return this.contractRepository.find({
      where: {
        expireIn: Between(today, afterWeek),
      },
      relations: ['property'],
    });
  }
  MyContractsExpiredAfterWeek(userId: number) {
    const today = new Date();
    const afterWeek = new Date();
    afterWeek.setDate(today.getDate() + 7);
    return this.getContracts(userId, {
      expireIn: Between(today, afterWeek),
    });
  }
  getContractsNumber(userId: number) {
    return this.contractRepository.count({
      where: { property: { agency: { id: userId } } },
    });
  }

  async getContracts(userId: number, where) {
    const user = (await lastValueFrom(
      await this.usersClient.send('users.findById', { id: userId }),
    )) as User;
    const contracts = await this.contractRepository.find({
      where: { userPhone: user.phone, ...where },
    });
    console.log({
      where: { user: { id: userId }, ...where },
    });
    const contracts2 = await this.contractRepository.find({
      where: {
        agency: { id: userId },
        ...where,
      },
    });
    const contracts3 = await this.contractRepository.find({
      where: {
        ownerPhone: user.phone,
        ...where,
      },
    });
    return contracts.concat(contracts2, contracts3);
  }
}
