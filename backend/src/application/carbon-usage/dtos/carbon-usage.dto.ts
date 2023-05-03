import { ApiProperty } from '@nestjs/swagger';
import { CarbonUsageTypeDto } from './carbon-usage-type.dto';

export class CarbonUsageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  type: CarbonUsageTypeDto;

  @ApiProperty()
  amount: number;
}
