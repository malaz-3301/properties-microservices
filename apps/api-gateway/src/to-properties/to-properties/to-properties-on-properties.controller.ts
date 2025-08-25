import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { retry, timeout } from 'rxjs/operators';
import { DeleteUserDto } from '@malaz/contracts/dtos/users/users/delete-user.dto';
import { CreatePropertyDto } from '@malaz/contracts/dtos/properties/properties/create-property.dto';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { UpdatePropertyDto } from '@malaz/contracts/dtos/properties/properties/update-property.dto';

@Controller('properties-on')
export class ToPropertiesOnPropertiesController {
  constructor(
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() owner: JwtPayloadType,
  ) {
    console.log('mohammed321');
    return this.propertiesClient
      .send('properties.create', {
        createPropertyDto,
        owner: owner.id,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Get('my')
  @UseGuards(AuthGuard)
  getOwnerPros(
    @CurrentUser() owner: JwtPayloadType,
    @Query() query: FilterPropertyDto,
  ) {
    return this.propertiesClient
      .send('properties.getOwnerPros', { query, ownerId: owner.id })
      .pipe(retry(2), timeout(5000));
  }

  @Patch('my/:proId')
  @UseGuards(AuthGuard)
  updateOwnerPro(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() owner: JwtPayloadType,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesClient
      .send('properties.updateOwnerPro', {
        proId,
        ownerId: owner.id,
        updatePropertyDto,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Delete(':proId')
  @UseGuards(AuthGuard)
  deleteOwnerPro(
    @Param('proId', ParseIntPipe) proId: number,
    @Body() deleteUserDto: DeleteUserDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('properties.deleteOwnerPro', {
        proId,
        userId: user.id,
        password: deleteUserDto.password,
      })
      .pipe(retry(2), timeout(5000));
  }

  /*  @Delete('remove-img/:proId')
  @UseGuards(AuthGuard)
  removeSingleImage(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.propertiesService.removeSingleImage(proId, user.id);
  }*/
}
