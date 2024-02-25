import {
  Module,
} from '@nestjs/common';
import {
  ConfigModule,
} from '@nestjs/config';
import {
  JwtModule,
} from '@nestjs/jwt';
import {
  PassportModule,
} from '@nestjs/passport';
import * as Joi from 'joi';

import {
  APP_GUARD,
} from '@nestjs/core';
import {
  AppController,
} from './app.controller';
import {
  AppService,
} from './app.service';
import {
  AuthModule,
} from './auth/auth.module';
import {
  JwtAuthGuard,
} from './auth/jwt-auth.guard';
import {
  PrismaModule,
} from './prisma/prisma.module';
import {
  PrismaService,
} from './prisma/prisma.service';
import {
  UsersModule,
} from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        CLERK_ISSUER_URL: Joi.string().required(),
      }),
    }),
    PassportModule,
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
