import { Module } from '@nestjs/common';
import { FromCommerceController } from './from-commerce.controller';
import { TranslateService } from './from-commerce.service';

@Module({
  controllers: [FromCommerceController],
  providers: [TranslateService],
})
export class FromCommerceModule {}
