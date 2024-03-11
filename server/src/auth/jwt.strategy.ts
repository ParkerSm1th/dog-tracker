import {
  User,
} from '@common/models';
import {
  Injectable,
} from '@nestjs/common';
import {
  ConfigService,
} from '@nestjs/config';
import {
  PassportStrategy,
} from '@nestjs/passport';
import {
  ClerkJWT,
} from 'common/models/clerk';
import * as dotenv from 'dotenv';
import {
  passportJwtSecret,
} from 'jwks-rsa';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import {
  UsersService,
} from '../users/users.service';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private userService: UsersService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${
          configService.get(
            'CLERK_ISSUER_URL',
          )
        }/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `${configService.get('CLERK_ISSUER_URL')}`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: ClerkJWT): Promise<User> {
    const { sub } = payload;
    const user = await this.userService.findOne(sub);
    return user;
  }
}
