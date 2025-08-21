import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { View } from './entities/view.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from '../properties/properties.module';
import { User } from '../../../users-micro/src/users/entities/user.entity';
import { UsersModule } from '../../../users-micro/src/users/users.module';

@Module({
  imports: [
    PropertiesModule,
    UsersModule,
    TypeOrmModule.forFeature([View, User]),
  ],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}
