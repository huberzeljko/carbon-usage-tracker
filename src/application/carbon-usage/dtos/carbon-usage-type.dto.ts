import { ApiProperty } from '@nestjs/swagger';

export class CarbonUsageTypeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  unit: string;
}
