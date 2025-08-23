import { Controller } from '@nestjs/common';
import { UsersGetProvider } from '../../users/providers/users-get.provider';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class FromAuthController {
  constructor(private readonly usersGetProvider: UsersGetProvider) {}

  @MessagePattern('otp.findById')
  async handleFindByIdOtp(@Payload() payload: { id: number }) {
    const { id } = payload;
    return await this.usersGetProvider.findByIdOtp(id);
  }
}
