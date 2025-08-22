import { Controller } from '@nestjs/common';
import { DuplicateService } from './duplicate.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from '../../users/users.service';

@Controller()
export class DuplicateController {
  constructor(
    private readonly duplicateService: DuplicateService,
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern('users.findById')
  async findById(@Payload() payload: { id: number }) {
    const { id } = payload;
    return await this.usersService.getUserById(id);
  }
}
