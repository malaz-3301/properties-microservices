import { Controller } from '@nestjs/common';
import { UsersRpcMediaService } from './users-rpc-media.service';

@Controller('users-rpc-media')
export class UsersRpcMediaController {
  constructor(private readonly usersRpcMediaService: UsersRpcMediaService) {}
}
