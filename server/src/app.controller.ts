import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  AppService,
  HelloReturn,
} from './app.service';
import {
  JwtAuthGuard,
} from './auth/jwt-auth.guard';
import {
  Public,
  User,
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
  getTest(@User() user: {
    userId: string;
  }): string {
    console.log(user);
    return 'test';
  }
}
