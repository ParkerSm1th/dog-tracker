import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  AppService,
  HelloReturn,
} from './app.service';
import {
  Public,
} from './decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): HelloReturn {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): string {
    return 'test';
  }
}
