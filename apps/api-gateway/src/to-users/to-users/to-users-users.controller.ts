import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
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
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { UpdateUserDto } from '@malaz/contracts/dtos/users/users/update-user.dto';
import { RegisterUserDto } from '@malaz/contracts/dtos/users/users/register-user.dto';
import { DeleteUserDto } from '@malaz/contracts/dtos/users/users/delete-user.dto';
import { FilterUserDto } from '@malaz/contracts/dtos/users/users/filter-user.dto';
import { UpdateUserByAdminDto } from '@malaz/contracts/dtos/users/users/update-user-by-admin.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, retry, timeout } from 'rxjs';

@Controller('users')
export class ToUsersUsersController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {} // أي اسم client

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    console.log('fklsd');
    return this.usersClient
      .send('users.register', registerUserDto)
      .pipe(retry(2), timeout(10000));
  }

  @Post('back')
  async register_back_users() {
    return this.usersClient
      .send('users.register_back', {})
      .pipe(retry(2), timeout(10000));
  }

  @Post('verify/:id')
  otpVerify(@Body('code') code: string, @Param('id', ParseIntPipe) id: number) {
    return this.usersClient
      .send('users.otpVerify', { code, id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('resend/:id')
  otpReSend(@Param('id', ParseIntPipe) id: number) {
    return this.usersClient
      .send('users.otpReSend', { id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('timer/:id')
  otpTimer(@Param('id', ParseIntPipe) id: number) {
    return this.usersClient
      .send('users.otpTimer', { id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('plan/:planId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  setUserPlan(
    @Param('planId', ParseIntPipe) planId: number,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.usersClient
      .send('users.setUserPlan', { userId: user.id, planId })
      .pipe(retry(2), timeout(5000));
  }

  @Get('agency')
  @UseGuards(AuthGuard)
  getAllAgency(@Query() query: FilterUserDto) {
    return this.usersClient.send('users.getAllAgency', query).pipe(
      retry(2),
      timeout(5000),
      catchError((err) => {
        throw err;
      }),
    );
  }

  @Get('agency/:agencyId')
  @UseGuards(AuthGuard)
  getOneAgency(@Param('agencyId', ParseIntPipe) agencyId: number) {
    return this.usersClient
      .send('users.getOneAgency', { agencyId })
      .pipe(retry(2), timeout(10000));
  }

  @Get('pro/:id')
  @UseGuards(AuthGuard)
  getUserProsById(@Param('id', ParseIntPipe) id: number) {
    return this.usersClient
      .send('users.getUserProsById', { userId: id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('/getUsers')
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  getAllAUsers(@Query() query: FilterUserDto) {
    return this.usersClient
      .send('users.getAllUsers', query)
      .pipe(retry(2), timeout(5000));
  }

  @Get('/pending')
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  getAllPending(@Query() query: FilterUserDto) {
    return this.usersClient
      .send('users.getAllPending', query)
      .pipe(retry(2), timeout(5000));
  }

  @Get('getAdmins')
  @Roles(UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  getAllAdmins(@Query() query: FilterUserDto) {
    return this.usersClient
      .send('users.getAllAdmins', query)
      .pipe(retry(2), timeout(5000));
  }

  @Get('getAdminById/:id')
  @Roles(UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  getAdminById(@Param('id', ParseIntPipe) id: number) {
    console.log('jjj');
    return this.usersClient
      .send('users.getAdminById', { id })
      .pipe(retry(2), timeout(5000));
  }

  @Get(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN, UserType.AGENCY)
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersClient
      .send('users.getUserById', { userId: id })
      .pipe(retry(2), timeout(5000));
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateMe(
    @CurrentUser() payload: JwtPayloadType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersClient
      .send('users.updateMe', { userId: payload.id, updateUserDto })
      .pipe(retry(2), timeout(5000));
  }

  @Patch('upgrade/:userId')
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  upgradeUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersClient
      .send('users.upgradeUser', { userId })
      .pipe(retry(2), timeout(5000));
  }

  @Patch(':id')
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserByAdminDto: UpdateUserByAdminDto,
  ) {
    return this.usersClient
      .send('users.updateUserById', { userId: id, updateUserByAdminDto })
      .pipe(retry(2), timeout(5000));
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  deleteById(
    @Param('id', ParseIntPipe) id: number,
    @Body('message') message: string,
  ) {
    return this.usersClient
      .send('users.deleteById', { userId: id, message })
      .pipe(retry(2), timeout(5000));
  }

  @Delete('')
  @Roles(UserType.Owner, UserType.AGENCY)
  @UseGuards(AuthRolesGuard)
  deleteMe(
    @CurrentUser() payload: JwtPayloadType,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    return this.usersClient
      .send('users.deleteMe', {
        userId: payload.id,
        password: deleteUserDto.password,
      })
      .pipe(retry(2), timeout(5000));
  }
}
