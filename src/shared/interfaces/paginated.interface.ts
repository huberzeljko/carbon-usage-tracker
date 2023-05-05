import { IPagingInfo } from './paging-info.interface';

export interface IPaginated<T> {
  items: T[];
  pagingInfo: IPagingInfo;
}
