// types/pagination.ts

export type SortItem = {
  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  ascending: boolean;
  descending: boolean;
};

export type LexPages<T> = {
  content: T[];
  first: boolean;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  sort: SortItem[];
};