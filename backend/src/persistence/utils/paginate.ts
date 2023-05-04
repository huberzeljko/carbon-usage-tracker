import { SelectQueryBuilder } from 'typeorm';
import { IPaginated, IPagingFilter } from '@app/shared/interfaces';
import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export async function paginate<Entity extends ObjectLiteral>(
  paging: IPagingFilter,
  builder: SelectQueryBuilder<Entity>,
): Promise<IPaginated<Entity>> {
  validatePaging(paging);

  const { page, pageSize } = paging;
  const { skip, take } = transform(paging);

  const [items, count] = await builder.take(take).skip(skip).getManyAndCount();

  return {
    items: items,
    pagingInfo: {
      page: page,
      pageSize: pageSize,
      totalItems: count,
    },
  };
}

function transform({ page, pageSize }: IPagingFilter): {
  skip: number;
  take: number;
} {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

function validatePaging({ page, pageSize }: IPagingFilter) {
  if (page <= 0) {
    throw new BadRequestException('Page needs to be number bigger than 0');
  }

  if (pageSize <= 0) {
    throw new BadRequestException('Page size needs to be number bigger than 0');
  }
}
