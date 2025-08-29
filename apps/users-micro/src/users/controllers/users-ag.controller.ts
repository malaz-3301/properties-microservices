import { Controller } from '@nestjs/common';
import { UsersService } from '../users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users-ag')
export class UsersAgController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.upgradeToAgency')
  async upgrade(
    @Payload()
    Payload: {
      userId: number;
      filenames: string[];
      agencyCommissionRate: number;
      lat: number;
      lon: number;
    },
  ) {
    return this.usersService.upgradeToAgency(
      Payload.userId,
      Payload.filenames,
      Payload.agencyCommissionRate,
      Payload.lat,
      Payload.lon,
    );
  }

  //and admins
  @MessagePattern('users.getUserById')
  async getUserById(@Payload() payload: { userId: number }) {
    const { userId } = payload;
    return this.usersService.getUserById(userId);
  }
}
