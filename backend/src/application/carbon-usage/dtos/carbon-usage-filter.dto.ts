import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { PagingFilterDto } from '@app/shared';
import { Instant } from '@js-joda/core';
import { ApiProperty } from '@nestjs/swagger';

export class CarbonUsageFilterDto extends PagingFilterDto {
  @IsNotEmpty()
  @IsOptional()
  from?: Instant;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  to?: Instant;

  @IsNotEmpty()
  @IsOptional()
  @IsIn(['amount', 'type', 'usageAt'])
  @ApiProperty()
  sortField?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiProperty()
  sortDirection?: 'ASC' | 'DESC';
}
