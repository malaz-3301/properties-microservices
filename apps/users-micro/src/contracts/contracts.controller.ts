import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { CreateContractDto } from '@malaz/contracts/dtos/users/contracts/create-contract.dto';
import { UpdateContractDto } from '@malaz/contracts/dtos/users/contracts/update-contract.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserType } from '@malaz/contracts/utils/enums';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @MessagePattern('contracts.create')
  create(
    @Payload()
    payload: {
      userId: number;
      createContractDto: CreateContractDto;
    },
  ) {
    return this.contractsService.create(
      payload.userId,
      payload.createContractDto,
    );
  }

  @MessagePattern('contracts.getMyActiveContracts')
  getMyActiveContracts(@Payload() payload: { userId: number }) {
    return this.contractsService.getMyActiveContracts(payload.userId);
  }

  @MessagePattern('contracts.getMyExpiredContracts')
  getMyExpiredContracts(@Payload() payload: { userId: number }) {
    return this.contractsService.getMyExpiredContracts(payload.userId);
  }

  @MessagePattern('contracts.getMyContracts')
  getMyContracts(@Payload() payload: { userId: number }) {
    return this.contractsService.getMyContracts(payload.userId);
  }

  @MessagePattern('contracts.expiredaAfterWeekOrLess')
  expiredaAfterWeekOrLess(@Payload() payload: { userId: number }) {
    return this.contractsService.MyContractsExpiredAfterWeek(payload.userId);
  }

  @MessagePattern('contracts.expiredAfterWeek')
  expiredAfterWeek() {
    return this.contractsService.expiredAfterWeek();
  }

  @MessagePattern('contracts.findAll')
  findAll() {
    return this.contractsService.findAll();
  }

  @MessagePattern('contracts.findOne')
  findOne(
    @Payload() payload: { id: number; userType: UserType; userId: number },
  ) {
    return this.contractsService.findOne(
      payload.id,
      payload.userType,
      payload.userId,
    );
  }

  @MessagePattern('contracts.update')
  update(
    @Payload() payload: { id: number; updateContractDto: UpdateContractDto },
  ) {
    return this.contractsService.update(payload.id, payload.updateContractDto);
  }

  @MessagePattern('contracts.remove')
  remove(@Payload() payload: { id: number }) {
    return this.contractsService.remove(payload.id);
  }
}
