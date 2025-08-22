import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { ClientProxy } from '@nestjs/microservices';
import { retry, timeout } from 'rxjs/operators';

@Controller('favorite')
export class ToPropertiesFavoriteController {
  constructor(
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Post('/:prodId')
  @UseGuards(AuthGuard)
  changeStatusOfFavorite(
    @CurrentUser() user: JwtPayloadType,
    @Param('prodId', ParseIntPipe) prodId: number,
  ) {
    return this.propertiesClient
      .send('favorite.changeStatus', { userId: user.id, prodId })
      .pipe(retry(2), timeout(5000));
  }

  @Get('')
  @UseGuards(AuthGuard)
  getAllFavorites(@CurrentUser() user: JwtPayloadType) {
    return this.propertiesClient
      .send('favorite.getAll', { userId: user.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('isFavorite/:proId')
  @UseGuards(AuthGuard)
  isFavorite(
    @CurrentUser() user: JwtPayloadType,
    @Param('proId', ParseIntPipe) prodId: number,
  ) {
    return this.propertiesClient
      .send('favorite.isFavorite', { userId: user.id, prodId })
      .pipe(retry(2), timeout(5000));
  }

  // @Delete('')
  // @UseGuards(AuthGuard)
  // deleteAll(@CurrentUser() user: JwtPayloadType) {
  //   return this.propertiesClient
  //     .send('favorite.deleteAll', { userId: user.id })
  //     .pipe(retry(2), timeout(5000));
  // }

  // @Get(':id')
  // @UseGuards(AuthGuard)
  // getFavorite(
  //   @CurrentUser() user: JwtPayloadType,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.propertiesClient
  //     .send('favorite.getById', { userId: user.id, id })
  //     .pipe(retry(2), timeout(5000));
  // }
}
