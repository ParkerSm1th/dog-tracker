import {
  User,
} from '@common/models';
import {
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SortUserDto {
  @IsString()
  orderBy: keyof User;

  @IsString()
  order: string;
}

export class QueryUserDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sort?: SortUserDto[] | null;
}

export class FindOneUserDto {
  @IsString()
  id: string;
}
