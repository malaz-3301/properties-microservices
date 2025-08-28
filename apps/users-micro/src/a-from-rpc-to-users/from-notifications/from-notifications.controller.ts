import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from '../../users/users.service';
import { UsersGetProvider } from '../../users/providers/users-get.provider';

@Controller()
export class FromNotificationsController {
  constructor(private readonly usersGetProvider: UsersGetProvider) {}
  @MessagePattern('users.findByPhone')
  async findByPhone(@Payload() payload: { phone: string }) {
    return await this.usersGetProvider.findByPhone(payload.phone);
  }
}
