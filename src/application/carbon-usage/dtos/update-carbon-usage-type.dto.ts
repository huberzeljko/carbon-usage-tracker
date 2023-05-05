import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCarbonUsageTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  unit: string;
}
