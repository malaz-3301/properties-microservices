import { Controller, Get } from '@nestjs/common';


@Controller()
export class ApiGatewayController {
  constructor() {}

  @Get()
  getHello(): string {
    return "Hello World!";
  }
}
