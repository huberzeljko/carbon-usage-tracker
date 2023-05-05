import { IsDate, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Instant } from '@js-joda/core';

export class CreateCarbonUsageDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  typeId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ type: Date })
  usageAt: Instant;
}
