import {
  PartialType,
} from '@nestjs/mapped-types';
import {
  IsOptional,
} from 'class-validator';
import {
  CreateUserDto,
} from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  firstName?: string | null;

  @IsOptional()
  lastName?: string | null;

  @IsOptional()
  image?: string | null;
}
