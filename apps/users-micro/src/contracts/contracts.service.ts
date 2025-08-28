import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateContractDto } from '@malaz/contracts/dtos/users/contracts/create-contract.dto';
import { UpdateContractDto } from '@malaz/contracts/dtos/users/contracts/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  async create(userId: number, createContractDto: CreateContractDto) {
    const isActive = await this.contractRepository.findOne({
      where: {
        property: { id: createContractDto.propertyId },
        expireIn: MoreThan(new Date()),
      },
    });
    if (isActive) {
      throw new HttpException('property not avilable now', 404);
    }
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + createContractDto.time);
    return this.contractRepository.save({
      ...createContractDto,
      user: { id: userId },
      expireIn: validUntil,
      property: { id: createContractDto.propertyId },
      agency: { id: userId },
    });

    // await this.notificationsService.sendNotificationForAllSidesInProperties(
    //   newContract,
    //   'RentedSuccessfully',
    // );
  }

  findAll() {
    return this.contractRepository.find();
  }

  findOne(id: number) {
    return this.contractRepository.findOne({ where: { id } });
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
    const contracts = await this.contractRepository.find({
      where: {
        user: { id: userId },
        expireIn: MoreThan(new Date()),
      },
    });
    return contracts;
  }

  async getMyExpiredContracts(userId: number) {
    const contracts = await this.contractRepository.find({
      where: {
        user: { id: userId },
        expireIn: LessThan(new Date()),
      },
    });
    return contracts;
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
    return this.contractRepository.find({
      where: {
        expireIn: Between(today, afterWeek),
        user: { id: userId },
      },
      relations: ['property'],
    });
  }

  getContractsNumber(userId: number) {
    return this.contractRepository.count({
      where: { property: { agency: { id: userId } } },
    });
  }
}
