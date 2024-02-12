import {
  Module,
} from '@nestjs/common';
import {
  APP_GUARD,
} from '@nestjs/core';
import {
  JwtAuthGuard,
} from '../guards';
import {
  AuthController,
} from './auth.controller';
import {
  AuthService,
} from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
