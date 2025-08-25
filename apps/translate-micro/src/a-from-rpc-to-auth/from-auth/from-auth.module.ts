import { Module } from '@nestjs/common';
import { FromAuthController } from './from-auth.controller';
import { TranslateService } from './from-auth.service';


@Module({
  controllers: [FromAuthController],
  providers: [TranslateService],
})
export class FromAuthModule {}
