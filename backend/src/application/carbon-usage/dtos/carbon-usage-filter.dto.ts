import { IsNotEmpty, IsOptional } from 'class-validator';
import { PagingFilterDto } from '@app/shared';
import { Instant } from '@js-joda/core';

export class CarbonUsageFilterDto extends PagingFilterDto {
  @IsNotEmpty()
  @IsOptional()
  from?: Instant;

  @IsNotEmpty()
  @IsOptional()
  to?: Instant;
}
