import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ClerkUser,
} from 'common/models/clerk';
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
    console.log('hi');
    return this.appService.getHello();
  }

  @Get('test')
  getTest(@User() user: ClerkUser): {
    user: ClerkUser;
  } {
    console.log(user);
    return {
      user,
    };
  }
}
