import { Controller } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';

@Controller()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @MessagePattern('favorite.changeStatus')
  async changeStatusOfFavorite(
    @Payload() payload: { user: JwtPayloadType; prodId: number }
  ) {
    return this.favoriteService.changeStatusOfFavorite(payload.user.id, payload.prodId);
  }

  @MessagePattern('favorite.getAll')
  async getAllFavorites(@Payload() payload: { user: JwtPayloadType }) {
    return this.favoriteService.getAllFavorites(payload.user.id);
  }

  @MessagePattern('favorite.isFavorite')
  async isFavorite(@Payload() payload: { user: JwtPayloadType; prodId: number }) {
    return this.favoriteService.isFavorite(payload.user.id, payload.prodId);
  }
}
