import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  ClerkUser,
} from 'common/models/clerk';
import {
  AppService,
  HelloReturn,
} from './app.service';
import {
  HTTPUser,
  Public,
} from './decorators';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Public()
  @Get()
  getHello(): HelloReturn {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(@HTTPUser() user: ClerkUser): {
    user: ClerkUser;
  } {
    return {
      user,
    };
  }
}
