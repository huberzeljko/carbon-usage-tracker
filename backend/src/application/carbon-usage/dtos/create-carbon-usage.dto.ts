import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarbonUsageDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  typeId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}
