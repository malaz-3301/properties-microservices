import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersMicroService {
  getHello(): string {
    return 'Hello World!';
  }
}
