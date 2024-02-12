import {
  Controller,
  Get,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import {
  Request,
} from 'express';
import {
  HttpUser,
} from '../decorators';
import {
  HttpGoogleOAuthGuard,
} from '../guards';
import {
  AuthService,
} from './auth.service';
import {
  GoogleLoginUserDto,
} from './dto/google-login.dto';

@SetMetadata('google-login', true)
@UseGuards(HttpGoogleOAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  async googleAuth(@Req() _req: Request) {}

  @Get('google-redirect')
  googleAuthRedirect(@HttpUser() user: GoogleLoginUserDto) {
    return this.authService.googleLogin(user);
  }
}
