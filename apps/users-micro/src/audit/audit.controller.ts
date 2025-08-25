import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { AuditService } from './audit.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @MessagePattern('users-audit.findAll')
  findAll() {
    return this.auditService.findAll();
  }

  @MessagePattern('users-audit.findOne')
  findOne(@Payload() payload: { id: number }) {
    return this.auditService.findOne(payload.id);
  }
}
