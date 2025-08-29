import { Controller, Get, UseGuards } from '@nestjs/common';
import { HoneypotService } from './honeypot.service';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { UserType } from '@malaz/contracts/utils/enums';

@Controller('honeypot')
export class HoneypotController {
  constructor(private readonly honeypotService: HoneypotService) {}

  @UseGuards(AuthRolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  @Get()
  async getHoneyPots() {
    return this.honeypotService.getHoneyPots();
  }
}
