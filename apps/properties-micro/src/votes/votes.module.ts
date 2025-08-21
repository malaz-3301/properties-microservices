import { forwardRef, Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';

import { PropertiesModule } from '../properties/properties.module';
import { Property } from '../properties/entities/property.entity';

import { VotesGetProvider } from './providers/votes-get.provider';
import { User } from '../../../users-micro/src/users/entities/user.entity';
import { UsersModule } from '../../../users-micro/src/users/users.module';
import { AuditModule } from '../../../users-micro/src/audit/audit.module';

@Module({
  imports: [
    UsersModule,
    AuditModule,
    TypeOrmModule.forFeature([Vote, Property, User]),
    forwardRef(() => PropertiesModule),
  ],
  controllers: [VotesController],
  providers: [VotesService, VotesGetProvider],
  exports: [VotesService],
})
export class VotesModule {}
