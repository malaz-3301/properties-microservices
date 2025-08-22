import { Controller } from '@nestjs/common';
import { PropertiesRpcMediaService } from './properties-rpc-media.service';

@Controller('properties-rpc-media')
export class PropertiesRpcMediaController {
  constructor(private readonly propertiesRpcMediaService: PropertiesRpcMediaService) {}
}
