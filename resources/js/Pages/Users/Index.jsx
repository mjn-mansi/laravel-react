import DataTable from "@/Components/DataTables/DataTable";
import { Head } from "@inertiajs/react";

// Define columns once per page
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
];

export default function Users({data, filters, pageInfo}) {
    return <>
      <Head title="Users" />
      <div className="p-6">
        <DataTable 
          data={data} 
          columns={columns} 
          filters={filters} 
          pageInfo={pageInfo} 
        />
      </div>
    </>
}