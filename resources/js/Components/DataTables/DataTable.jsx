import { router } from '@inertiajs/react';
import { useState, useCallback, useRef } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ 
  data, 
  columns, 
  filters = {}, 
  pageInfo, 
  pathname = window.location.pathname 
}) => {
  // Inline debounce refs
  const searchTimeoutRef = useRef();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: pageInfo.last_page,
  });

  // FIXED: Handle sorting - send to backend immediately
  const handleSortingChange = (updater) => {
    const newSorting = typeof updater === 'function' ? updater([]) : updater;
    const sort = newSorting[0];
    
    if (sort) {
      const params = {
        ...filters,
        sort: sort.id,
        direction: sort.desc ? 'desc' : 'asc',
        page: 1
      };
      router.get(pathname, params, { replace: true, preserveState: true });
    }
  };

  // Debounced search
  const debouncedSearch = (term) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      const params = { ...filters, search: term || null, page: 1 };
      router.get(pathname, params, { replace: true, preserveState: true });
    }, 300);
  };

  const updateFilters = useCallback((newFilters) => {
    router.get(pathname, newFilters, { replace: true, preserveState: true });
  }, [pathname]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search records..."
        value={localSearch}
        onChange={(e) => {
          setLocalSearch(e.target.value);
          debouncedSearch(e.target.value);
        }}
        className="max-w-md"
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={() => {
                      if (header.column.getCanSort()) {
                        header.column.toggleSorting();
                        handleSortingChange(table.getState().sorting);
                      }
                    }}
                    className={header.column.getCanSort() 
                      ? 'cursor-pointer select-none hover:bg-muted' 
                      : ''
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {/* Visual sort indicator */}
                    {header.column.getIsSorted() && (
                      <span className="ml-1">
                        {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-md">
        <div className="text-sm text-muted-foreground">
          Page {pageInfo.current_page} of {pageInfo.last_page} | {pageInfo.total} total
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ ...filters, page: pageInfo.current_page - 1 })}
            disabled={pageInfo.current_page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ ...filters, page: pageInfo.current_page + 1 })}
            disabled={pageInfo.current_page === pageInfo.last_page}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
