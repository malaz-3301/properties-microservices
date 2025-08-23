import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UsersService } from '../../users/users.service';

@Controller()
export class FromCommerceController {
  constructor(protected readonly usersService: UsersService) {}

  @EventPattern('users.setUserPlan')
  async setUserPlan(@Payload() payload: { userId: number; planId: number }) {
    const { userId, planId } = payload;
    return await this.usersService.setUserPlan(userId, planId);
  }
}
