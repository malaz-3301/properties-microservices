import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { UserType } from '@malaz/contracts/utils/enums';


@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    //رح ياخذ المفتاح من اقرب metadata
    const roles: UserType = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return false;
    }
    ///
    const req: Request = context.switchToHttp().getRequest();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException(
        "Token must be provided and Type 'Bearer'",
      );
    }
    let payload: JwtPayloadType;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('token is incorrect or expired');
    }

    if (!roles.includes(payload.userType)) {
      console.log(payload.userType);
      return false;
    }
    req['payload'] = payload;
    return true;
  }
}
