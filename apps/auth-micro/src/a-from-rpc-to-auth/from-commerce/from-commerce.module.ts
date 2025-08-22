import { Module } from '@nestjs/common';
import { FromCommerceService } from './from-commerce.service';
import { FromCommerceController } from './from-commerce.controller';

@Module({
  controllers: [FromCommerceController],
  providers: [FromCommerceService],
})
export class FromCommerceModule {}
