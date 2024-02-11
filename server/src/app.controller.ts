import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  AppService,
  HelloReturn,
} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloReturn {
    return this.appService.getHello();
  }
}
