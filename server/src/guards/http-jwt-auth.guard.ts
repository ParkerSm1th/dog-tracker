import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import {
  Reflector,
} from '@nestjs/core';
import {
  AuthGuard,
} from '@nestjs/passport';
import {
  IS_PUBLIC_KEY,
} from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isGoogleLogin = this.reflector.getAllAndOverride('google-login', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic || isGoogleLogin) {
      return true;
    }
    return super.canActivate(context);
  }
}
