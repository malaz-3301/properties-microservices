import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { CreateReportDto } from '@malaz/contracts/dtos/reports/create-report.dto';
import { ReportsMicroService } from './reports-micro.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ReportsMicroController {
  constructor(private readonly reportsMicroService: ReportsMicroService) {}

  // إنشاء تقرير
  @MessagePattern('reports.create')
  async report(@Payload() dto: CreateReportDto) {
    return this.reportsMicroService.report(dto);
  }

  // جلب كل التقارير
  @MessagePattern('reports.getAll')
  async getAll(@Payload() payload: { userId: number }) {
    return this.reportsMicroService.getAll(payload.userId);
  }

  // جلب كل التقارير المعلقة
  @MessagePattern('reports.getAllPending')
  async getAllPending(@Payload() payload: { userId: number }) {
    return this.reportsMicroService.getAllPending(payload.userId);
  }

  // جلب تقرير واحد
  @MessagePattern('reports.getOne')
  async getOne(@Payload() payload: { reportId: number; userId: number }) {
    return this.reportsMicroService.getOne(payload.reportId, payload.userId);
  }

  // اخفاء التقرير
  @MessagePattern('reports.update')
  async update(@Payload() payload: { reportId: number; action: boolean }) {
    return this.reportsMicroService.hide(payload.reportId);
  }
}
