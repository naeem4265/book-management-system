export interface Pagination {
  totalItems?: number;
  limit?: number;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  endCursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination;
}
