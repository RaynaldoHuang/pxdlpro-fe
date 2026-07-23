import { useEffect, useMemo, useState } from "react";

type UseClientPaginationOptions = {
  initialPageSize?: number;
};

export function useClientPagination<T>(
  items: T[],
  { initialPageSize = 10 }: UseClientPaginationOptions = {},
) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [items, pageSize]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  const startIndex = (page - 1) * pageSize;
  const paginatedItems = useMemo(
    () => items.slice(startIndex, startIndex + pageSize),
    [items, pageSize, startIndex],
  );

  return {
    page,
    pageCount,
    pageSize,
    paginatedItems,
    startIndex,
    startItem: items.length === 0 ? 0 : startIndex + 1,
    endItem: Math.min(startIndex + pageSize, items.length),
    totalItems: items.length,
    setPage,
    setPageSize,
  };
}
