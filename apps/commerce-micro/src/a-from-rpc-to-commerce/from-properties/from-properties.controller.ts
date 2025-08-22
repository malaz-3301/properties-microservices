import { Controller } from '@nestjs/common';
import { FromPropertiesService } from './from-properties.service';

@Controller()
export class FromPropertiesController {
  constructor(private readonly fromPropertiesService: FromPropertiesService) {}
}
