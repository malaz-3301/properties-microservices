import { Controller } from '@nestjs/common';
import { FromNotificationsService } from './from-notifications.service';

@Controller()
export class FromNotificationsController {
  constructor(private readonly fromNotificationsService: FromNotificationsService) {}
}
