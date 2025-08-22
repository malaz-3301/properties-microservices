import { Controller } from '@nestjs/common';
import { FromReportsService } from './from-reports.service';

@Controller()
export class FromReportsController {
  constructor(private readonly fromReportsService: FromReportsService) {}
}
