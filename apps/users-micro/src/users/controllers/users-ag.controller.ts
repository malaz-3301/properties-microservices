import { BadRequestException, Controller } from '@nestjs/common';
import { UsersService } from '../users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users-ag')
export class UsersAgController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('userU.upgrade')
  async upgrade(
    @Payload()
    data: {
      userId: number;
      filenames: string[];
      agencyCommissionRate: number;
    },
  ) {
    const { userId, filenames, agencyCommissionRate } = data;

    if (agencyCommissionRate < 0 || agencyCommissionRate > 10) {
      throw new BadRequestException('Commission rate must be between 0 and 10');
    }

    if (!filenames || filenames.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    console.log('Files uploaded', { filenames });
    return this.usersService.upgrade(userId, filenames, agencyCommissionRate);
  }

  //and admins
  @MessagePattern('users.getUserById')
  async getUserById(@Payload() payload: { userId: number }) {
    const { userId } = payload;
    return this.usersService.getUserById(userId);
  }
}
