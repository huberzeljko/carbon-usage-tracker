import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCarbonUsageTypeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MaxLength(10)
  unit: string;
}
