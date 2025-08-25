import { Controller } from '@nestjs/common';
import { BannedService } from './banned.service';
import { CreateBannedDto } from '@malaz/contracts/dtos/users/banned/create-banned.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('banned')
export class BannedController {
  constructor(private readonly bannedService: BannedService) {}

  @MessagePattern('users-banned.create')
  create(
    @Payload() Payload: { userId: number; createBannedDto: CreateBannedDto },
  ) {
    return this.bannedService.create(Payload.createBannedDto, Payload.userId);
  }

  @MessagePattern('users-banned.findAll')
  findAll() {
    return this.bannedService.findAll();
  }

  @MessagePattern('users-banned.remove')
  remove(@Payload() payload : {id: number}) {
    return this.bannedService.remove(payload.id);
  }
}
