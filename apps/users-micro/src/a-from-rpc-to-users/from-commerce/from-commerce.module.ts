import { Module } from '@nestjs/common';
import { FromCommerceService } from './from-commerce.service';
import { FromCommerceController } from './from-commerce.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [FromCommerceController],
  providers: [FromCommerceService],
})
export class FromCommerceModule {}
