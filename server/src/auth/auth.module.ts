import {
  Module,
} from '@nestjs/common';
import {
  JwtAuthGuard,
} from './jwt-auth.guard';
import {
  JwtStrategy,
} from './jwt.strategy';

@Module({
  providers: [JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
