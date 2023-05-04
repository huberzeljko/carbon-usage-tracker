import { IPaginated, IPagingFilter } from '@app/shared/interfaces';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { paginate } from './paginate';
import mock = jest.mock;

const mockBuilder = {
  take: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
} as unknown as jest.Mocked<SelectQueryBuilder<ObjectLiteral>>;

describe('paginate', () => {
  it('should call getManyAndCount with correct skip and take values', async () => {
    await paginate({ page: 3, pageSize: 5 }, mockBuilder);

    expect(mockBuilder.take).toHaveBeenCalledWith(5);
    expect(mockBuilder.skip).toHaveBeenCalledWith(10);
    expect(mockBuilder.getManyAndCount).toHaveBeenCalled();
  });

  it('should return paginated result', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    const count = 2;
    const paging = {
      page: 1,
      pageSize: 10,
    };

    mockBuilder.getManyAndCount = jest.fn().mockResolvedValue([items, count]);

    const result: IPaginated<ObjectLiteral> = await paginate(
      paging,
      mockBuilder,
    );

    expect(result.items).toEqual(items);
    expect(result.pagingInfo.page).toEqual(paging.page);
    expect(result.pagingInfo.pageSize).toEqual(paging.pageSize);
    expect(result.pagingInfo.totalItems).toEqual(count);
  });

  it('should throw error for invalid paging parameters', async () => {
    const pagings = [
      [0, 0],
      [-1, 5],
      [3, -6],
      [0, 14],
      [2, 0],
      [-1, 0],
      [0, -7],
    ];

    for (const paging of pagings) {
      await expect(
        paginate({ page: paging[0], pageSize: paging[1] }, mockBuilder),
      ).rejects.toThrow();
    }
  });
});
