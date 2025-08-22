import { Controller } from '@nestjs/common';
import { FromAuthService } from './from-auth.service';

@Controller()
export class FromAuthController {
  constructor(private readonly fromAuthService: FromAuthService) {}
}
