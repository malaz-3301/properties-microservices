import { Controller } from '@nestjs/common';
import { FromCommerceService } from './from-commerce.service';

@Controller()
export class FromCommerceController {
  constructor(private readonly fromCommerceService: FromCommerceService) {}
}
