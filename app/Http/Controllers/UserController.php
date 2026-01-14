<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{

    public function __construct(protected DataTableService $dataTable) {}

    public function index(Request $request)
    {
        $query = User::query();

        $searchable = ['name', 'email']; // Dynamic per model
        $sortable = ['name', 'email', 'created_at'];

        $users = $this->dataTable->applyFilters($query, $request, $searchable, $sortable)
            ->pipe(fn($q) => $this->dataTable->paginate($q, $request));


        return Inertia::render('Users/Index', [
            'data' => $users->items(), // Array for TanStack
            'filters' => $request->only(['search', 'sort', 'direction']),
            'pageInfo' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ],
        ]);
    }
}
