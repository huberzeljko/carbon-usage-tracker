import { IPagingInfo } from '@app/shared/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class PagingInfoDto implements IPagingInfo {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalItems: number;
}
