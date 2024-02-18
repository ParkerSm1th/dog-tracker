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
  ClerkUser,
} from 'common/models/clerk';
import * as dotenv from 'dotenv';
import {
  passportJwtSecret,
} from 'jwks-rsa';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
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
    console.log('JwtStrategy initialized');
  }

  validate(payload: ClerkJWT): ClerkUser {
    // This one is really useful to check the jwt payload!
    console.log('Validating payload:', payload);
    return {
      id: payload.sub,
    };
  }
}
