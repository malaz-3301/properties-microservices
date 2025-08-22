import { Controller } from '@nestjs/common';
import { PlansService } from './plans.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePlanDto } from '@malaz/contracts/dtos/commerce/plans/create-plan.dto';
import { UpdatePlanDto } from '@malaz/contracts/dtos/commerce/plans/update-plan.dto';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @MessagePattern('plans.create')
  create(@Payload() payload: { createPlanDto: CreatePlanDto }) {
    return this.plansService.create(payload.createPlanDto);
  }

  @MessagePattern('plans.createBack')
  createBackPlanes() {
    console.log('back');
    return this.plansService.create_back_planes();
  }

  @MessagePattern('plans.update')
  update(@Payload() payload: { id: number; updatePlanDto: UpdatePlanDto }) {
    return this.plansService.update(payload.id, payload.updatePlanDto);
  }

  @MessagePattern('plans.findAll')
  findAll(@Payload() payload: { user: JwtPayloadType }) {
    return this.plansService.findAll(payload.user.id);
  }
}
