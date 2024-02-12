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
  AppController,
} from './app.controller';
import {
  AppService,
} from './app.service';
import {
  AuthController,
} from './auth/auth.controller';
import {
  AuthModule,
} from './auth/auth.module';
import {
  PrismaModule,
} from './prisma/prisma.module';
import {
  PrismaService,
} from './prisma/prisma.service';
import {
  GoogleStrategy,
  JwtStrategy,
} from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        APP_JWT_SECRET: Joi.string().required(),
      }),
    }),
    PassportModule,
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, JwtStrategy, PrismaService],
})
export class AppModule {}
