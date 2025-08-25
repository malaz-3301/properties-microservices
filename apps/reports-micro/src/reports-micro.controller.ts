import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateReportDto } from '@malaz/contracts/dtos/reports/create-report.dto';
import { ReportsMicroService } from './reports-micro.service';

@Controller()
export class ReportsMicroController {
  constructor(private readonly reportsMicroService: ReportsMicroService) {}

  // إنشاء تقرير
  @MessagePattern('reports.create')
  async report(@Payload() createReportDto: CreateReportDto) {
    return this.reportsMicroService.report(createReportDto);
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
    return await this.reportsMicroService.update(
      payload.reportId,
      payload.action,
    );
  }
}
