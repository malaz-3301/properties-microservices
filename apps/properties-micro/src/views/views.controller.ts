import { Controller } from '@nestjs/common';
import { ViewsService } from './views.service';
import { Payload } from '@nestjs/microservices';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { MessagePattern } from '@nestjs/microservices';

@Controller('view')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  // إنشاء view لمادة معينة
  @MessagePattern('view.create')
  async create(
    @Payload() payload: { proId: number; user: JwtPayloadType },
  ) {
    return this.viewsService.create(payload.proId, payload.user.id);
  }
}
