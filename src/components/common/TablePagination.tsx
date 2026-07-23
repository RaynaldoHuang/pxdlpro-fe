import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TablePaginationProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
};

export function TablePagination({
  page,
  pageCount,
  pageSize,
  totalItems,
  startItem,
  endItem,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}: TablePaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        Showing {startItem}-{endItem} of {totalItems}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <label className="flex items-center gap-2">
          <span>Rows</span>
          <span className="relative inline-flex">
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-8 min-w-16 appearance-none rounded-lg border border-input bg-background px-2.5 pr-8 text-center text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </span>
        </label>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            title="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <span className="min-w-20 text-center text-foreground">
            {page} / {pageCount}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
            title="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
