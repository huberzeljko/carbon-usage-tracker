import { ApiProperty } from '@nestjs/swagger';
import { CarbonUsageTypeDto } from './carbon-usage-type.dto';
import { Instant } from '@js-joda/core';

export class CarbonUsageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  type: CarbonUsageTypeDto;

  @ApiProperty()
  amount: number;

  @ApiProperty({ type: Date })
  usageAt: Instant;
}
