import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoriteController } from './favorite.controller';
import { UsersModule } from '../../../users-micro/src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), UsersModule],
  providers: [FavoriteService],
  controllers: [FavoriteController],
  exports: [FavoriteService],
})
export class FavoriteModule {}
