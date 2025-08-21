import { Controller, Get } from '@nestjs/common';
import { UsersMicroService } from './users-micro.service';

@Controller()
export class UsersMicroController {
  constructor(private readonly usersMicroService: UsersMicroService) {}

  @Get()
  getHello(): string {
    return this.usersMicroService.getHello();
  }
}
