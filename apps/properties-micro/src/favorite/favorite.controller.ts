import { Controller } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';

@Controller()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @MessagePattern('favorite.changeStatus')
  async changeStatusOfFavorite(
    @Payload() payload: { userId: number; prodId: number },
  ) {
    return this.favoriteService.changeStatusOfFavorite(
      payload.userId,
      payload.prodId,
    );
  }

  @MessagePattern('favorite.getAll')
  async getAllFavorites(@Payload() payload: { userId: number }) {
    return this.favoriteService.getAllFavorites(payload.userId);
  }

  @MessagePattern('favorite.isFavorite')
  async isFavorite(@Payload() payload: { userId: number; prodId: number }) {
    return this.favoriteService.isFavorite(payload.userId, payload.prodId);
  }
}
