import { Controller } from '@nestjs/common';
import { FromUsersService } from './from-users.service';

@Controller()
export class FromUsersController {
  constructor(private readonly fromUsersService: FromUsersService) {}
}
