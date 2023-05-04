import { IPaginated } from '@app/shared/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { PagingInfoDto } from './paging-info.dto';

export class PaginatedDto<T> implements IPaginated<T> {
  items: T[];

  @ApiProperty()
  pagingInfo: PagingInfoDto;
}
