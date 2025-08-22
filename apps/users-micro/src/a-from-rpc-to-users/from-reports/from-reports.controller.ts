import { Controller } from '@nestjs/common';
import { FromReportsService } from './from-reports.service';
import { UsersService } from '../../users/users.service';

@Controller()
export class FromReportsController {
  constructor(
    private readonly fromReportsService: FromReportsService,
    private readonly usersService: UsersService,
  ) {}
}
