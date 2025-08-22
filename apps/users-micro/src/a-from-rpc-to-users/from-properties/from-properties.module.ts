import { Module } from '@nestjs/common';
import { FromPropertiesService } from './from-properties.service';
import { FromPropertiesController } from './from-properties.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [FromPropertiesController],
  providers: [FromPropertiesService],
})
export class FromPropertiesModule {}
