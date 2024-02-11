import {
  Injectable,
} from '@nestjs/common';

export interface HelloReturn {
  msg: string;
}

@Injectable()
export class AppService {
  getHello(): HelloReturn {
    return {
      msg: 'Hello World!',
    };
  }
}
