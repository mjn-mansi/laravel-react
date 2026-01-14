<?php
// app/Services/DataTableService.php
namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class DataTableService
{
    public function applyFilters(Builder $query, Request $request, array $searchable = [], array $sortable = []): Builder
    {
        // Global search
        if ($search = $request->get('search')) {
            $query->where(function (Builder $q) use ($search, $searchable) {
                foreach ($searchable as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        // Sorting (single column for simplicity; extend to multi if needed)
        $sortField = $request->get('sort');
        $sortDirection = $request->get('direction', 'desc');
        if ($sortField && in_array($sortField, $sortable)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest(); // Default sort
        }

        return $query;
    }

    public function paginate(Builder $query, Request $request, int $perPage = 10): LengthAwarePaginator
    {
        return $query->paginate($perPage)->withQueryString()->appends($request->only(['search', 'sort', 'direction']));
    }
}
