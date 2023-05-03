import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarbonUsageDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  typeId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}
