import {
  Module,
} from '@nestjs/common';
import {
  UsersService,
} from 'src/users/users.service';
import {
  JwtAuthGuard,
} from './jwt-auth.guard';
import {
  JwtStrategy,
} from './jwt.strategy';

@Module({
  providers: [UsersService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
